const submissionService = require("../services/submissions.service");
const JSend = require("../jsend");
const ApiError = require("../api-error");

async function createSubmission(req, res, next) {
  try {
    const submissionData = {
      aid: req.params.aid,
      s_status: "submitted",
      s_submitted_at: new Date().toISOString(),
      ...req.body,
    };

    const { sid, attachments, ...info } =
      await submissionService.createSubmission(submissionData, req.files);

    return res.status(201).json(JSend.success({ sid, ...info, attachments }));
  } catch (error) {
    if (error.statusCode)
      return next(new ApiError(error.statusCode, error.message));

    console.log(error);
    return next(new ApiError(500, "Internal Server Error"));
  }
}

async function getSubmissions(req, res, next) {
  let result = {
    submissions: [],
    metadata: {
      totalRecord: 0,
      firstPage: 1,
      lastPage: 1,
      page: 1,
      limit: 5,
    },
  };

  try {
    result = await submissionService.getSubmissions(req.params.aid, req.query);
  } catch (error) {
    if (error.statusCode)
      return next(new ApiError(error.statusCode, error.message));

    console.log(error);
    return next(new ApiError(500, "Internal Server Error"));
  }

  return res.json(
    JSend.success({
      submissions: result.submissions,
      metadata: result.metadata,
    })
  );
}

async function getSubmission(req, res, next) {
  const { uid, aid } = req.query;

  try {
    const submission = await submissionService.getSubmission(uid, aid);
    if (!submission) {
      return next(new ApiError(404, "Submission not found"));
    }
    return res.json(JSend.success({ submission }));
  } catch (error) {
    if (error.statusCode)
      return next(new ApiError(error.statusCode, error.message));

    console.log(error);
    return next(new ApiError(500, "Internal Server Error"));
  }
}

async function updateSubmission(req, res, next) {
  const { uid, aid } = req.body;

  try {
    const updated = await submissionService.updateSubmission(
      uid,
      aid,
      req.files
    );

    if (!updated) return next(new ApiError(404, "Submission not found"));

    return res.json(JSend.success({ updated }));
  } catch (error) {
    if (error.statusCode)
      return next(new ApiError(error.statusCode, error.message));

    console.log(error);
    return next(new ApiError(500, "Internal Server Error"));
  }
}

async function deleteSubmission(req, res, next) {
  const { sid } = req.params;

  try {
    const deleted = await submissionService.deleteSubmission(sid);

    if (!deleted) return next(new ApiError(404, "Submission not found"));

    return res.json(JSend.success());
  } catch (error) {
    if (error.statusCode)
      return next(new ApiError(error.statusCode, error.message));

    console.log(error);
    return next(new ApiError(500, "Internal Server Error"));
  }
}

async function gradeSubmission(req, res, next) {
  const { sid } = req.params;

  try {
    const updated = await submissionService.gradeSubmission(sid, req.body);

    if (!updated) return next(new ApiError(404, "Submission not found"));

    return res.json(JSend.success({ updated }));
  } catch (error) {
    if (error.statusCode)
      return next(new ApiError(error.statusCode, error.message));

    console.log(error);
    return next(new ApiError(500, "Internal Server Error"));
  }
}

module.exports = {
  createSubmission,
  getSubmissions,
  getSubmission,
  updateSubmission,
  deleteSubmission,
  gradeSubmission,
};
