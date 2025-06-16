const assignmentsService = require("../services/assignments.service");
const ApiError = require("../api-error");
const JSend = require("../jsend");

async function createAssignment(req, res, next) {
  try {
    const assignmentData = {
      cid: req.params.cid,
      ...req.body,
    };

    const { aid, attachments, ...info } =
      await assignmentsService.createAssignment(assignmentData, req.files);

    return res.status(201).json(JSend.success({ aid, ...info, attachments }));
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Internal Server Error"));
  }
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
