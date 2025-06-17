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

module.exports = {
    getStatistics,
}