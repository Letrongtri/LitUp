const JSend = require("../jsend");

function createClassroom(req, res) {
  return res.status(201).json(JSend.success({ classroom: {} }));
}

function getClassrooms(req, res) {
  return res.status(201).json(JSend.success({ classrooms: [] }));
}

function getClassroom(req, res) {
  return res.status(201).json(JSend.success({ classroom: {} }));
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
