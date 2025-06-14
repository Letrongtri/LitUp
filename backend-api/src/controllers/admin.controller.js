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

function getAllUsers(req, res) {
  return res.status(201).json(JSend.success({ users: [] }));
}

function toggleUserStatus(req, res) {
  return res.status(201).json(JSend.success({ user: {} }));
}

function getAllClassrooms(req, res) {
  return res.status(201).json(JSend.success({ classrooms: [] }));
}

function toggleClassroomStatus(req, res) {
  return res.status(201).json(JSend.success({ classroom: {} }));
}

function toggleAssignmentStatus(req, res) {
  return res.status(201).json(JSend.success({ assignment: {} }));
}

module.exports = {
  overview,
  getAllUsers,
  toggleUserStatus,
  getAllClassrooms,
  toggleClassroomStatus,
  toggleAssignmentStatus,
};
