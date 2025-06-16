const knex = require('../database/knex');
function classroomRepository() {
    return knex('classrooms');
}

function readClassroomData(payload) {
    return {
        ...(payload.uid && { uid: payload.uid }),
        ...(payload.c_name && { c_name: payload.c_name }),
        ...(payload.c_code && { c_code: payload.c_code }),
        ...(payload.c_status !== undefined && { c_status: payload.c_status })
    };
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

async function updateClassroom(cid, updateData) {
    const updatedClassroom = await classroomRepository()
    .where('cid', cid)
    .select('*')
    .first();
    if(!updatedClassroom) {
        return null;
    }

    const classroomData = readClassroomData(updateData);
    if(Object.keys(classroomData).length>0) {
        await classroomRepository().where('cid', cid).update(classroomData);
    }
    return{ ...updatedClassroom, ...classroomData };
}

async function deleteClassroom(cid) {
    const deletedClassroom = await classroomRepository()
    .where('cid', cid)
    .first()
    if(!deletedClassroom) {
        return null;
    }

    await classroomRepository().where('cid', cid).del();
    return deletedClassroom;
}

module.exports = {
    createClassroom,
    getClassroomById,
    updateClassroom,
    deleteClassroom
}