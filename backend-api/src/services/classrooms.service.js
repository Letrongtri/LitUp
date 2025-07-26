const knex = require("../database/knex");
const Paginator = require("./paginator");
function classroomRepository() {
  return knex("classrooms");
}

function memberRepository() {
  return knex("members");
}

function userRepository() {
  return knex("users");
}

function attachmentRepository() {
  return knex("attachments");
}

function readClassroomData(payload) {
  return {
    ...(payload.uid && { uid: payload.uid }),
    ...(payload.c_name && { c_name: payload.c_name }),
    ...(payload.c_code && { c_code: payload.c_code }),
    ...(payload.c_status !== undefined && { c_status: payload.c_status }),
  };
}

function generateCode(length = 6) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function extractClassroomData(payload) {
  return {
    uid: payload.uid,
    c_name: payload.c_name,
    c_code: generateCode(6),
  };
}

async function createClassroom(payload) {
  const classroomData = extractClassroomData(payload);

  const { u_role } = await userRepository()
    .where("uid", classroomData.uid)
    .select("u_role")
    .first();

  if (u_role != "teacher") return { code: 401, message: "Unauthorized access" };

  const [result] = await classroomRepository()
    .insert(classroomData)
    .returning("cid");
  return { cid: result.cid, ...classroomData };
}

async function getClassroomById(cid) {
  return await knex("classrooms as c")
    .join("users as u", "c.uid", "u.uid")
    .where("c.cid", cid)
    .select(
      "c.*",
      knex.raw("concat(u_first_name, ' ', u_last_name) as teacher_name")
    )
    .first();
}

async function getClassroomDetailByStudent(uid, cid) {
  const isMember = await knex("members")
    .where("cid", cid)
    .andWhere("uid", uid)
    .select("mid")
    .first();

  if (!isMember) {
    return null;
  }

  const data = await knex("classrooms as c")
    .join("users as u", "c.uid", "u.uid")
    .where("c.cid", cid)
    .select(
      "cid",
      "c_name",
      "c_created_at",
      knex.raw("concat(u_first_name, ' ', u_last_name) as teacher_name"),
      "u_avatar_id"
    )
    .first();

  const avatar = data.u_avatar_id
    ? await attachmentRepository().where("fid", data.u_avatar_id).first()
    : null;

  const DEFAULT_AVATAR = "/public/images/blank-profile-picture.png";

  return {
    ...data,
    teacher_avatar_url: avatar
      ? `/public/uploads/${avatar.f_name}`
      : DEFAULT_AVATAR,
  };
}

async function updateClassroom(cid, updateData) {
  const trx = await knex.transaction();

  try {
    const updatedClassroom = await classroomRepository()
      .transacting(trx)
      .where("cid", cid)
      .select("*")
      .first();
    if (!updatedClassroom) {
      return null;
    }

    if (updateClassroom.uid !== updateData.uid)
      return { code: 401, message: "Unauthorized access" };

    const classroomData = readClassroomData(updateData);
    classroomData.c_updated_at = new Date().toISOString();

    if (Object.keys(classroomData).length > 0) {
      updateData.c_updated_at = new Date().toISOString();
      await classroomRepository()
        .transacting(trx)
        .where("cid", cid)
        .update(classroomData);
    }
    await trx.commit();
    return { ...updatedClassroom, ...classroomData };
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}

async function deleteClassroom(cid) {
  const trx = await knex.transaction();

  try {
    const deletedClassroom = await classroomRepository()
      .transacting(trx)
      .where("cid", cid)
      .first();
    if (!deletedClassroom) {
      return null;
    }

    const countMember = await memberRepository()
      .transacting(trx)
      .where("cid", cid)
      .select(knex.raw("COUNT(mid) OVER() AS count_member"));

    if (countMember.count_member && countMember.count_member != 0) {
      return {
        code: 400,
        message: "Cannot delect a classroom with active members",
      };
    }

    await classroomRepository().transacting(trx).where("cid", cid).del();

    await trx.commit();
    return deletedClassroom;
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}

async function getClassroomsByUser(uid, limit, page) {
  const paginator = new Paginator(page, limit);

  const results = await knex("classrooms as c")
    .join("members as m", "c.cid", "m.cid")
    .join("users as u", "u.uid", "c.uid")
    .where("m.uid", uid)
    .andWhere("m.m_status", true)
    .select("c.*")
    .limit(limit)
    .offset((page - 1) * limit);

  const totalRecords = results[0]?.record_count ?? 0;

  const classrooms = results.map((result) => {
    result.record_count = undefined;
    return result;
  });

  return {
    metadata: paginator.getMetadata(totalRecords),
    classrooms,
  };
}

async function joinClassroomByCode(cid, uid, c_code) {
  const classroom = await classroomRepository().where({ cid }).first();
  if (!classroom) return null;

  if (classroom.c_code !== c_code) return { message: "Incorrect code" };

  const exists = await knex("members").where({ cid, uid }).first();

  if (exists) return { message: "Users has joined classroom" };

  return await knex("members")
    .insert({
      cid: classroom.cid,
      uid,
    })
    .returning("mid");
}

async function getMemberByClassId(cid) {
  const users = await knex("members as m")
    .join("users as u", "m.uid", "u.uid")
    .where("m.cid", cid)
    .andWhere("m.m_status", true)
    .select(
      "u.uid",
      "u.u_first_name",
      "u.u_last_name",
      "u.u_email",
      "u.u_avatar_id",
      "m.mid",
      "m.m_joined_at"
    );

  const DEFAULT_AVATAR = "/public/images/blank-profile-picture.png";

  for (const user of users) {
    const avatar = user.u_avatar_id
      ? await attachmentRepository().where("fid", user.u_avatar_id).first()
      : null;

    user.avatar_url = avatar
      ? `public/uploads/${avatar.f_name}`
      : DEFAULT_AVATAR;
  }

  return users;
}

async function removeMember(cid, mid) {
  const trx = await knex.transaction();

  try {
    await memberRepository()
      .transacting(trx)
      .where({ cid: cid, mid: mid })
      .del();

    await trx.commit();
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}

async function getClassroomsByTeacher(uid, limit = 10, page = 1) {
  // optional: validate that this uid belongs to a user with role "teacher"
  const teacher = await knex("users").where({ uid, u_role: "teacher" }).first();
  if (!teacher) return [];

  const data = await knex("classrooms as c")
    .leftJoin("members as m", "c.cid", "m.cid")
    .where({ "c.uid": uid })
    .groupBy("c.cid")
    .select("c.*", knex.raw("COUNT(m.mid) as student_count"))
    .limit(limit)
    .offset((page - 1) * limit)
    .orderBy("c.cid", "desc");

  return data;
}

module.exports = {
  createClassroom,
  getClassroomById,
  getClassroomDetailByStudent,
  updateClassroom,
  deleteClassroom,
  getClassroomsByUser,
  joinClassroomByCode,
  getMemberByClassId,
  getClassroomsByTeacher,
  removeMember,
};
