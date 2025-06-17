const knex = require("../database/knex");
const { saveFile, deleteFileByPath } = require("./attachments.service");
const Paginator = require("./paginator");

function assignmentRepository() {
  return knex("assignments");
}

function attachmentRepository() {
  return knex("attachments");
}

function submissionRepository() {
  return knex("submissions");
}

function assignmentAttachmentRepository() {
  return knex("assignment_attachments");
}

function readAssignmentData(payload) {
  return {
    ...(payload.cid ? { cid: payload.cid } : {}),
    ...(payload.a_title ? { a_title: payload.a_title } : {}),
    ...(payload.a_description ? { a_description: payload.a_description } : {}),
    ...(payload.a_max_points ? { a_max_points: payload.a_max_points } : {}),
    ...(payload.a_deadline_at ? { a_deadline_at: payload.a_deadline_at } : {}),
    ...(payload.a_allow_late_submission !== undefined && {
      a_allow_late_submission: payload.a_allow_late_submission,
    }),
  };
}

// Define functions for accessing the database

async function createAssignment(newAssignment, files) {
  const assignmentData = readAssignmentData(newAssignment);

  const [result] = await assignmentRepository()
    .insert(assignmentData)
    .returning("aid");
  const aid = result.aid;

  const attachments = [];
  for (const file of files) {
    const attachment = await saveFile(file);
    attachments.push(attachment);
    await assignmentAttachmentRepository().insert({
      fid: attachment.fid,
      aid,
    });
  }

  return { aid, ...assignmentData, attachments };
}

async function getAssignments(cid, query) {
  const { page = 1, limit = 5 } = query;
  const paginator = new Paginator(page, limit);

  const results = await assignmentRepository()
    .where("cid", cid)
    .select(
      knex.raw("COUNT(aid) OVER() AS record_count"),
      "aid",
      "a_title",
      "a_description",
      "a_max_points",
      "a_deadline_at",
      "a_allow_late_submission"
    )
    .orderBy("aid", "asc")
    .limit(paginator.limit)
    .offset(paginator.offset);

  const totalRecords = results[0]?.record_count ?? 0;

  const aids = results.map((r) => r.aid);

  const assignmentAttachments = await assignmentAttachmentRepository()
    .whereIn("aid", aids)
    .select("*");

  const fids = assignmentAttachments.map((a) => a.fid);

  const attachments = await attachmentRepository()
    .whereIn("fid", fids)
    .select("fid", "f_name", "f_original_name", "f_type", "f_size");

  const attachmentMap = new Map();
  attachments.forEach((a) => attachmentMap.set(a.fid, a));

  const assignmentMap = {};
  /** Duyệt qua từng dòng trong assignmentAttachemnts (aid, fid)
   * lấy chi tiết file trong từng attachmentMap
   * gom lại vào assignmentMap[aid]
   */
  for (const aa of assignmentAttachments) {
    if (!assignmentMap[aa.aid]) assignmentMap[aa.aid] = [];

    const fullAttachemnt = attachmentMap.get(aa.fid);
    if (fullAttachemnt) assignmentMap[aa.aid].push(fullAttachemnt);
  }

  const assignments = results.map((assignment) => {
    assignment.record_count = undefined;
    return {
      ...assignment,
      attachments: assignmentMap[assignment.aid] || [],
    };
  });

  return {
    metadata: paginator.getMetadata(totalRecords),
    assignments,
  };
}

async function getAssignment(aid) {
  const result = await assignmentRepository()
    .where("aid", aid)
    .select("*")
    .first();

  if (!result) return null;

  const fids = await assignmentAttachmentRepository()
    .where("aid", aid)
    .select("fid");

  if (!fids) return result;

  const fidList = fids.map((f) => f.fid);
  const attachments = await attachmentRepository()
    .whereIn("fid", fidList)
    .select("fid", "f_name", "f_original_name", "f_type", "f_size");

  const assignments = {
    ...result,
    attachments,
  };

  return assignments;
}

async function updateAssignment(aid, updateData, files) {
  const trx = await knex.transaction();

  try {
    const updatedAssignment = await assignmentRepository()
      .transacting(trx)
      .where("aid", aid)
      .select("*")
      .first();

    if (!updatedAssignment) {
      await trx.rollback();
      return null;
    }

    const assignmentData = readAssignmentData(updateData);
    let attachments = [];

    const oldFids = await assignmentAttachmentRepository()
      .transacting(trx)
      .where("aid", aid)
      .select("fid");

    const fidList = oldFids.map((f) => f.fid);

    let oldFiles = [];
    if (fidList.length > 0) {
      oldFiles = await attachmentRepository()
        .whereIn("fid", fidList)
        .select("fid", "f_name", "f_original_name", "f_type", "f_size");

      attachments = oldFiles;
    }

    if (files?.length) {
      // delete old files
      if (fidList.length > 0) {
        await assignmentAttachmentRepository()
          .transacting(trx)
          .where("aid", aid)
          .del();

        await attachmentRepository()
          .transacting(trx)
          .whereIn("fid", fidList)
          .del();

        oldFiles.forEach((f) => {
          deleteFileByPath(`/public/uploads/${f.f_name}`);
        });
      }

      // add new files
      attachments = [];
      for (const file of files) {
        const attachment = await saveFile(file);
        attachments.push(attachment);
        await assignmentAttachmentRepository().transacting(trx).insert({
          fid: attachment.fid,
          aid,
        });
      }
    }

    // Nếu có ít nhất một trường cần cập nhật, thực hiện truy vấn UPDATE
    if (Object.keys(assignmentData).length > 0) {
      await assignmentRepository()
        .transacting(trx)
        .where("aid", aid)
        .update(assignmentData);
    }

    await trx.commit();
    return { ...assignmentData, attachments };
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}

async function deleteAssignment(aid) {
  const trx = await knex.transaction();

  try {
    const deletedAssignment = await assignmentRepository()
      .transacting(trx)
      .where("aid", aid)
      .select("*")
      .first();

    if (!deletedAssignment) {
      await trx.rollback();
      return null;
    }

    const submission = await submissionRepository()
      .transacting(trx)
      .where("aid", aid)
      .first();

    if (submission) {
      await trx.rollback();
      throw new Error(
        "Cannot delete assignment: There are existing submissions."
      );
    }

    const fids = await assignmentAttachmentRepository()
      .transacting(trx)
      .where("aid", aid)
      .select("fid");

    const fidList = fids.map((f) => f.fid);

    if (fidList.length > 0) {
      const fList = await attachmentRepository()
        .whereIn("fid", fidList)
        .select("f_name");

      const fName = fList.map((f) => f.f_name);

      await assignmentAttachmentRepository()
        .transacting(trx)
        .where("aid", aid)
        .del();

      await attachmentRepository()
        .transacting(trx)
        .whereIn("fid", fidList)
        .del();

      fName.forEach((f) => {
        deleteFileByPath(`/public/uploads/${f}`);
      });
    }

    await assignmentRepository().transacting(trx).where("aid", aid).del();

    await trx.commit();
    return { deletedAssignment };
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}

module.exports = {
  createAssignment,
  getAssignments,
  getAssignment,
  updateAssignment,
  deleteAssignment,
};
