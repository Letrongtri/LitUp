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

async function getAssignments(req, res, next) {
  let result = {
    assignments: [],
    metadata: {
      totalRecord: 0,
      firstPage: 1,
      lastPage: 1,
      page: 1,
      limit: 5,
    },
  };

  try {
    result = await assignmentsService.getAssignments(req.params.cid, req.query);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Internal Server Error"));
  }

  return res.json(
    JSend.success({
      assignments: result.assignments,
      metadata: result.metadata,
    })
  );
}

async function getAssignment(req, res, next) {
  const { aid } = req.params;

  try {
    const assignment = await assignmentsService.getAssignment(aid);
    if (!assignment) {
      return next(new ApiError(404, "Assignment not found"));
    }
    return res.json(JSend.success({ assignment }));
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Internal Server Error"));
  }
}

async function updateAssignment(req, res, next) {
  const { aid } = req.params;

  try {
    const updated = await assignmentsService.updateAssignment(
      aid,
      req.body,
      req.files
    );

    if (!updated) return next(new ApiError(404, "Assignment not found"));

    return res.json(JSend.success({ updated }));
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Internal Server Error"));
  }
}

async function deleteAssignment(req, res, next) {
  const { aid } = req.params;

  try {
    const deleted = await assignmentsService.deleteAssignment(aid);

    if (!deleted) return next(new ApiError(404, "Assignment not found"));

    return res.json(JSend.success());
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Internal Server Error"));
  }
}

module.exports = {
  createAssignment,
  getAssignments,
  getAssignment,
  updateAssignment,
  deleteAssignment,
};
