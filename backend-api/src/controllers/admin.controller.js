const adminService = require("../services/admin.service");
const ApiError = require("../api-error");
const JSend = require("../jsend");

async function overview(req, res, next) {
  try {
    const stats = await adminService.getStatistics();
    return res.json(JSend.success({stats}));
  }catch (err) {
    console.log(err);
    return next(new ApiError(500, 'Internal Server Error'));
  }
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
