const knex = require('../database/knex');
function classroomRepository() {
    return knex('classrooms');
}

function extractClassroomData(payload) {
    return {
        uid: payload.uid,
        c_name: payload.c_name,
        c_code: Math.random().toString(36).substring(6).toUpperCase()
    };
}


async function createClassroom(payload) {
    const classroomData = extractClassroomData(payload);
    // classroomData lúc này đã bao gồm uid
    const [result] = await classroomRepository()
        .insert(classroomData)
        .returning('cid');
    return { cid: result.cid, ...classroomData };
}


async function getClassroomById(cid) {
    return classroomRepository().where('cid', cid).select('*').first();
}


module.exports = {
    createClassroom,
    getClassroomById
}