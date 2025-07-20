const express = require("express");
const { z } = require("zod");

const submissionsController = require("../controllers/submissions.controller");
const allowedMethods = require("../middlewares/allowedMethods.middleware");

// middlewares
const { validateRequest } = require("../middlewares/validator.middleware");
const { filesUpload } = require("../middlewares/files-upload.middleware");

const router = express.Router();

/** Get Submission id */
const getSubmissionId = z.object({
  input: z
    .object({
      sid: z.coerce.number().nonnegative(),
    })
    .strict(),
});

/** Get Submission data */
const getSubmissionData = z.object({
  input: z
    .object({
      uid: z.coerce.number().nonnegative(),
      aid: z.coerce.number().nonnegative(),
    })
    .strict(),
});

/** Get updated submission data */
const updateSubmissionData = z.object({
  input: z
    .object({
      uid: z.coerce.number().nonnegative(),
      aid: z.coerce.number().nonnegative(),
      attachments: z.any(),
    })
    .strict(),
});

module.exports.setup = (app) => {
  app.use("/api/student/submissions", router);

  router
    .route("/")
    .get(
      validateRequest(getSubmissionData),
      submissionsController.getSubmission
    )
    .put(
      [filesUpload, validateRequest(updateSubmissionData)],
      submissionsController.updateSubmission
    )
    .delete(
      validateRequest(getSubmissionId),
      submissionsController.deleteSubmission
    )
    .all(allowedMethods(["GET", "PUT"]));

  router
    .route("/:sid")
    .delete(
      validateRequest(getSubmissionId),
      submissionsController.deleteSubmission
    )
    .all(allowedMethods(["DELETE"]));
};
