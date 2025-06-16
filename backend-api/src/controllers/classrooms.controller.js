const classroomsService = require('../services/classroom.service');
const ApiError = require('../api-error');
const JSend = require("../jsend");

async function createClassroom(req, res, next) {
  try {
    const classroomData = {
      ...req.body,
    };
    
    const classroom = await classroomsService.createClassroom(classroomData);
    return res
    .status(201)
    .set({
      Locarion: `${req.baseUrl}/${classroom.cid}}`,
    })
    .json (
      JSend.success({
        classroom,
      })
    );
  }catch (err) {
    console.log(err);
    return next(new ApiError(500, 'Internal Server Error'));
  }
 
}

async function getClassrooms(req, res, next) {
  try {
    const { uid, limit = 10, page = 1 } = req.query;

    if (!uid) {
      return next(new ApiError(400, "uid is required"));
    }

    const classrooms = await classroomsService.getClassroomsByUser(uid, limit, page);
    return res.json(JSend.success({ classrooms }));
  } catch (err) {
    console.log("getClassrooms error:", err);
    return next(new ApiError(500, 'Internal Server Error'));
  }
}



async function getClassroom(req, res, next) {
  const { cid } = req.params;

  try {
    const classroom = await classroomsService.getClassroomById(cid);
    if(!classroom) {
      return next(new ApiError(404, 'Classroom not found'));
    }

    return res.json(JSend.success({ classroom }));
  }catch (err) {
    console.log(err);
    return next(new ApiError(500, 'Internal Server Error'));
  }
}

async function updateClassroom(req, res, next) {
  const { cid } = req.params;
  
  try {
    const updateData = {
      ...req.body
    };

    const updated = await classroomsService.updateClassroom(cid, updateData);
    if(!updated) {
      return next(new ApiError(404, 'Classroom not found'));
    }

    return res.json(
      JSend.success({
        classroom: updated,
      })
    );
  }catch (err) {
    console.log(err);
    return next(new ApiError(500, 'Internal Server Error'));
  }
} 

async function deleteClassroom(req, res, next) {
  const { cid } = req.params;

  try {
    const deleted = await classroomsService.deleteClassroom(cid);
    if(!deleted) {
      return next(new ApiError(404, 'Classroom not found'));
    }

    return res.json(JSend.success());
  }catch (err) {
    console.log(err);
    return next(new ApiError(500, 'Internal Server Error'));
  }
}

function joinClassroom(req, res) {
  return res.status(201).json(JSend.success({ users: [] }));
}

function getMembersInClass(req, res) {
  return res.status(201).json(JSend.success({ users: [] }));
}

module.exports = {
  createClassroom,
  getClassrooms,
  getClassroom,
  updateClassroom,
  deleteClassroom,
  joinClassroom,
  getMembersInClass,
};
