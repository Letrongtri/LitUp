const knex = require('../database/knex');

async function getStatistics() {
    const [
        { count: totalUsers },
        { count: activeUsers },
        { count: toatlClassrooms },
        { count: activeClassrooms },
        { count: totalAssignments },
        { count: totalSubmissions },
    ] = await Promise.all([
        knex('users').count("*").first(),
        knex("users").where({u_status: true}).count("*").first(),
        knex("classrooms").count("*").first(),
        knex("classrooms").where({c_status: true}).count("*").first(),
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
    const user = await knex('users')
    .where({uid})
    .first();

    if(!user) return null;

    await knex('users')
    .where({uid})
    .update({u_status, u_updated_at: new Date()});

    return {...user, u_status};
}

async function getAllClassrooms(limit, page) {
    return knex("classrooms")
    .select("*")
    .limit(limit)
    .offset((page - 1) * limit)
    .orderBy("cid", "asc");
}

async function toggleClassroomStatus(cid, c_status) {
    const classroom = await knex('classrooms')
    .where({cid})
    .first();

    if(!classroom) return null;

    await knex('classrooms')
    .where({cid})
    .update({c_status, c_updated_at: new Date()});

    return {...classroom, c_status};
}

async function toggleAssignmentStatus(aid, a_status) {
    const assignment = await knex('assignments')
    .where({aid})
    .first();

    if(!assignment) return null;

    await knex('assignments')
    .where({aid})
    .update({a_status, a_updated_at: new Date()});

    return {...assignment, a_status};
}
module.exports = {
    getStatistics,
    getAllUsers,
    toggleUserStatus,
    getAllClassrooms,
    toggleClassroomStatus,
    toggleAssignmentStatus,
}