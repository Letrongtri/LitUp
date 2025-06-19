const knex = require("../database/knex");

async function getStatistics() {
  const [
    { count: totalUsers },
    { count: activeUsers },
    { count: toatlClassrooms },
    { count: activeClassrooms },
    { count: totalAssignments },
    { count: totalSubmissions },
  ] = await Promise.all([
    knex("users").count("*").first(),
    knex("users").where({ u_status: true }).count("*").first(),
    knex("classrooms").count("*").first(),
    knex("classrooms").where({ c_status: true }).count("*").first(),
    knex("assignments").count("*").first(),
    knex("submissions").count("*").first(),
  ]);

  return {
    totalUsers: Number(totalUsers),
    activeUsers: Number(activeUsers),
    toatlClassrooms: Number(toatlClassrooms),
    activeClassrooms: Number(activeClassrooms),
    totalAssignments: Number(totalAssignments),
    totalSubmissions: Number(totalSubmissions),
  };
}

async function getAllUsers(limit, page) {
  return knex("users")
    .select("*")
    .limit(limit)
    .offset((page - 1) * limit)
    .orderBy("uid", "asc");
}

async function toggleUserStatus(uid, u_status) {
  const trx = await knex.transaction();

  try {
    const user = await knex("users").transacting(trx).where({ uid }).first();

    if (!user) return null;

    await knex("users")
      .transacting(trx)
      .where({ uid })
      .update({ u_status, u_updated_at: new Date() });

    await trx.commit();
    return { ...user, u_status };
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}

async function getAllClassrooms(limit, page) {
  return knex("classrooms")
    .select("*")
    .limit(limit)
    .offset((page - 1) * limit)
    .orderBy("cid", "asc");
}

async function toggleClassroomStatus(cid, c_status) {
  const trx = await knex.transaction();

  try {
    const classroom = await knex("classrooms")
      .transacting(trx)
      .where({ cid })
      .first();

    if (!classroom) return null;

    await knex("classrooms")
      .transacting(trx)
      .where({ cid })
      .update({ c_status, c_updated_at: new Date() });

    trx.commit();
    return { ...classroom, c_status };
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}

async function toggleAssignmentStatus(aid, a_status) {
  const trx = await knex.transaction();

  try {
    const assignment = await knex("assignments")
      .transacting(trx)
      .where({ aid })
      .first();

    if (!assignment) return null;

    await knex("assignments")
      .transacting(trx)
      .where({ aid })
      .update({ a_status, a_updated_at: new Date() });

    await trx.commit();
    return { ...assignment, a_status };
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}
module.exports = {
  getStatistics,
  getAllUsers,
  toggleUserStatus,
  getAllClassrooms,
  toggleClassroomStatus,
  toggleAssignmentStatus,
};
