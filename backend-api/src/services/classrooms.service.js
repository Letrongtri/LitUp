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
    console.log(countMember);

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
    .where("m.uid", uid)
    .andWhere("m.m_status", true)
    .select(
      knex.raw("COUNT(c.cid) OVER() AS record_count"),
      "c.cid",
      "c.uid",
      "c.c_name",
      "c.c_status",
      "c.c_created_at",
      "c.c_updated_at"
    )
    .orderBy("c.cid")
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

async function getClassroomsByTeacher(uid, limit = 10, page = 1) {
  // optional: validate that this uid belongs to a user with role "teacher"
  const teacher = await knex("users").where({ uid, u_role: "teacher" }).first();
  if (!teacher) return [];

  return knex("classrooms")
    .where({ uid })
    .andWhere("u_role", "teacher")
    .limit(limit)
    .offset((page - 1) * limit)
    .orderBy("cid", "desc");
}

module.exports = {
  createClassroom,
  getClassroomById,
  updateClassroom,
  deleteClassroom,
  getClassroomsByUser,
  joinClassroomByCode,
  getMemberByClassId,
  getClassroomsByTeacher,
};
