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

function getClassrooms(req, res,) {
  return res.status(201).json(JSend.success({ classrooms: [] }));
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

function updateClassroom(req, res) {
  return res.status(201).json(JSend.success({ classroom: {} }));
}

function deleteClassroom(req, res) {
  return res.status(201).json(JSend.success());
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
