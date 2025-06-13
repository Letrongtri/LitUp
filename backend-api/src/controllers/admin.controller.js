const JSend = require("../jsend");

function overview(req, res) {
  return res.status(201).json(
    JSend.success({
      users: {},
      classrooms: {},
      assignments: {},
      submissions: {},
      assignment: {},
    })
  );
}

function getUsers(req, res) {
  return res.status(201).json(JSend.success({ users: [] }));
}

function updateUser(req, res) {
  return res.status(201).json(JSend.success({ user: {} }));
}

function getClassrooms(req, res) {
  return res.status(201).json(JSend.success({ classrooms: [] }));
}

function updateClassroom(req, res) {
  return res.status(201).json(JSend.success({ classroom: {} }));
}

function updateAssignment(req, res) {
  return res.status(201).json(JSend.success({ assignment: {} }));
}

module.exports = {
  overview,
  getUsers,
  updateUser,
  getClassrooms,
  updateClassroom,
  updateAssignment,
};
