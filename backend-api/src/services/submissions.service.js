const ApiError = require("../api-error");
const knex = require("../database/knex");
const {
  saveFile,
  getAttachments,
  deleteFileByPath,
} = require("./attachments.service");
const Paginator = require("./paginator");

function submissionRepository() {
  return knex("submissions");
}

function attachmentRepository() {
  return knex("attachments");
}

function submissionAttachmentRepository() {
  return knex("submission_attachments");
}

function assignmentRepository() {
  return knex("assignments");
}

function readSubmissionData(payload) {
  return {
    ...(payload.aid ? { aid: payload.aid } : {}),
    ...(payload.uid ? { uid: payload.uid } : {}),
    ...(payload.s_status ? { s_status: payload.s_status } : {}),
    ...(payload.s_submitted_at
      ? { s_submitted_at: payload.s_submitted_at }
      : {}),
    ...(payload.s_updated_at ? { s_updated_at: payload.s_updated_at } : {}),
    ...(payload.s_grade ? { s_grade: payload.s_grade } : {}),
    ...(payload.s_comment ? { s_comment: payload.s_comment } : {}),
    ...(payload.s_graded_at ? { s_graded_at: payload.s_graded_at } : {}),
  };
}

// Define functions for accessing the database

async function createSubmission(newSubmission, files) {
  const trx = await knex.transaction();

  try {
    const submissionData = readSubmissionData(newSubmission);

    const [result] = await submissionRepository()
      .transacting(trx)
      .insert(submissionData)
      .returning("sid");
    const sid = result.sid;

    const attachments = [];
    for (const file of files) {
      const attachment = await saveFile(file, trx);
      attachments.push(attachment);
      await submissionAttachmentRepository().transacting(trx).insert({
        fid: attachment.fid,
        sid,
      });
    }

    trx.commit();
    return { sid, ...submissionData, attachments };
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}

async function getSubmissions(aid, query) {
  const { page = 1, limit = 5 } = query;
  const paginator = new Paginator(page, limit);

  const results = await submissionRepository()
    .where("aid", aid)
    .select(
      knex.raw("COUNT(sid) OVER() AS record_count"),
      "sid",
      "aid",
      "uid",
      "s_status",
      "s_submitted_at",
      "s_updated_at",
      "s_grade",
      "s_comment",
      "s_graded_at"
    )
    .orderBy("sid", "asc")
    .limit(paginator.limit)
    .offset(paginator.offset);

  const totalRecords = results[0]?.record_count ?? 0;

  const sids = results.map((r) => r.sid);

  const submissionAttachments = await submissionAttachmentRepository()
    .whereIn("sid", sids)
    .select("*");

  const fids = submissionAttachments.map((s) => s.fid);

  const attachments = await getAttachments(fids);

  const attachmentMap = new Map();
  attachments.forEach((a) => attachmentMap.set(a.fid, a));

  const submissionMap = {};
  for (const sa of submissionAttachments) {
    if (!submissionMap[sa.aid]) submissionMap[sa.sid] = [];

    const fullAttachemnt = attachmentMap.get(sa.fid);
    if (fullAttachemnt) submissionMap[sa.sid].push(fullAttachemnt);
  }

  const submissions = results.map((submission) => {
    submission.record_count = undefined;
    return {
      ...submission,
      attachments: submissionMap[submission.sid] || [],
    };
  });

  return {
    metadata: paginator.getMetadata(totalRecords),
    submissions,
  };
}

async function getSubmission(sid) {
  const result = await submissionRepository()
    .where("sid", sid)
    .select("*")
    .first();

  if (!result) return null;

  const fids = await submissionAttachmentRepository()
    .where("sid", sid)
    .select("fid");

  if (!fids) return result;

  const fidList = fids.map((f) => f.fid);
  const attachments = await getAttachments(fidList);

  const submission = {
    ...result,
    attachments,
  };

  return submission;
}

async function updateSubmission(sid, files) {
  const trx = await knex.transaction();

  try {
    const updatedSubmission = await submissionRepository()
      .transacting(trx)
      .where("sid", sid)
      .select("*")
      .first();

    if (!updatedSubmission) {
      await trx.rollback();
      return null;
    }

    const oldFids = await submissionAttachmentRepository()
      .transacting(trx)
      .where("sid", sid)
      .select("fid");

    const fidList = oldFids.map((f) => f.fid);

    let oldFiles = await getAttachments(fidList);

    // delete old files
    await submissionAttachmentRepository()
      .transacting(trx)
      .where("sid", sid)
      .del();

    await attachmentRepository().transacting(trx).whereIn("fid", fidList).del();

    oldFiles.forEach((f) => {
      deleteFileByPath(`/public/uploads/${f.f_name}`);
    });

    // add new files
    let attachments = [];
    for (const file of files) {
      const attachment = await saveFile(file, trx);
      attachments.push(attachment);
      await submissionAttachmentRepository().transacting(trx).insert({
        fid: attachment.fid,
        sid,
      });
    }

    updatedSubmission.s_updated_at = new Date().toISOString();

    await submissionRepository()
      .transacting(trx)
      .where("sid", sid)
      .update("s_updated_at", updatedSubmission.s_updated_at);

    await trx.commit();
    return { ...updatedSubmission, attachments };
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}

async function deleteSubmission(sid) {
  const trx = await knex.transaction();

  try {
    const deletedSubmission = await submissionRepository()
      .transacting(trx)
      .where("sid", sid)
      .select("*")
      .first();

    if (!deletedSubmission) {
      await trx.rollback();
      return null;
    }

    if (deletedSubmission.s_grade != undefined) {
      await trx.rollback();
      throw new ApiError(400, "Cannot delete graded submission");
    }

    const fids = await submissionAttachmentRepository()
      .transacting(trx)
      .where("sid", sid)
      .select("fid");

    const fidList = fids.map((f) => f.fid);

    const fList = await attachmentRepository()
      .whereIn("fid", fidList)
      .select("f_name");

    const fName = fList.map((f) => f.f_name);

    await submissionAttachmentRepository()
      .transacting(trx)
      .where("sid", sid)
      .del();

    await attachmentRepository().transacting(trx).whereIn("fid", fidList).del();

    fName.forEach((f) => {
      deleteFileByPath(`/public/uploads/${f}`);
    });

    await submissionRepository().transacting(trx).where("sid", sid).del();

    await trx.commit();
    return { deletedSubmission };
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}

async function gradeSubmission(sid, data) {
  const trx = await knex.transaction();

  try {
    const submission = await submissionRepository()
      .transacting(trx)
      .where("sid", sid)
      .select("sid", "aid", "uid", "s_submitted_at", "s_updated_at")
      .first();

    if (!submission) {
      await trx.rollback();
      return null;
    }

    let gradeData = await readSubmissionData(data);

    const maxPoints = await assignmentRepository()
      .transacting(trx)
      .where("aid", submission.aid)
      .select("a_max_points")
      .first();

    if (gradeData.s_grade > maxPoints.a_max_points) {
      await trx.rollback();
      throw new ApiError(
        400,
        "Grade must be lower than max points of this assignment"
      );
    }

    gradeData.s_graded_at = new Date().toISOString();
    gradeData.s_status = "graded";

    await submissionRepository()
      .transacting(trx)
      .where("sid", sid)
      .update(gradeData);

    const fids = await submissionAttachmentRepository()
      .transacting(trx)
      .where("sid", sid)
      .select("fid");

    const fidList = fids.map((f) => f.fid);

    let attachments = await getAttachments(fidList);

    await trx.commit();
    return { ...submission, ...gradeData, attachments };
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}

module.exports = {
  createSubmission,
  getSubmissions,
  getSubmission,
  updateSubmission,
  deleteSubmission,
  gradeSubmission,
};
