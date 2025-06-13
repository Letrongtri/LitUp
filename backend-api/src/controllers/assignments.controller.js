const JSend = require("../jsend");

function createAssignment(req, res) {
  return res.status(201).json(JSend.success({ assignment: {} }));
}

function getAssignments(req, res) {
  return res.status(201).json(JSend.success({ assignments: [] }));
}

function getAssignment(req, res) {
  return res.status(201).json(JSend.success({ assignment: {} }));
}

function updateAssignment(req, res) {
  return res.status(201).json(JSend.success({ assignment: {} }));
}

function deleteAssignment(req, res) {
  return res.status(201).json(JSend.success());
}

module.exports = {
  createAssignment,
  getAssignments,
  getAssignment,
  updateAssignment,
  deleteAssignment,
};
