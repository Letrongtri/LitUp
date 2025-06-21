const knex = require("../database/knex");
function classroomRepository() {
  return knex("classrooms");
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
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
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
  const [result] = await classroomRepository()
    .insert(classroomData)
    .returning("cid");
  return { cid: result.cid, ...classroomData };
}

async function getClassroomById(cid) {
  return classroomRepository().where("cid", cid).select("*").first();
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

    const classroomData = readClassroomData(updateData);
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

    await classroomRepository().transacting(trx).where("cid", cid).del();

    await trx.commit();
    return deletedClassroom;
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}

async function getClassroomsByUser(uid, limit, page) {
  return knex("classrooms as c")
    .join("members as m", "c.cid", "m.cid")
    .where("m.uid", uid)
    .andWhere("m.m_status", true)
    .select("c.*")
    .limit(limit)
    .offset((page - 1) * limit);
}

async function joinClassroomByCode(uid, c_code) {
  const classroom = await classroomRepository().where({ c_code }).first();
  if (!classroom) return null;

  const exists = await knex("members")
    .where({ cid: classroom.cid, uid, m_status: true })
    .first();

  if (exists) return null;

  const now = new Date();
  await knex("members").insert({
    cid: classroom.cid,
    uid,
    m_status: true,
    m_joined_at: now,
  });
  return true;
}

async function getMemberByClassId(cid) {
  return knex("members as m")
    .join("users as u", "m.uid", "u.uid")
    .where("m.cid", cid)
    .andWhere("m.m_status", true)
    .select(
      "u.uid",
      "u.u_first_name",
      "u.u_last_name",
      "u.u_email",
      "m.m_joined_at"
    );
}

module.exports = {
  createClassroom,
  getClassroomById,
  updateClassroom,
  deleteClassroom,
  getClassroomsByUser,
  joinClassroomByCode,
  getMemberByClassId,
};
