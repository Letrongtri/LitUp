const express = require("express");
const { z } = require("zod");

const submissionsController = require("../controllers/submissions.controller");
const allowedMethods = require("../middlewares/allowedMethods.middleware");

// middlewares
const { validateRequest } = require("../middlewares/validator.middleware");

// schemas
const { submissionSchema } = require("../schemas/submission.schemas");

const router = express.Router();

/** Get Submission id */
const getSubmissionId = z.object({
  input: z
    .object({
      sid: z.coerce.number().nonnegative(),
    })
    .strict(),
});

/** Grade submission */
const gradeSubmissionData = z.object({
  input: submissionSchema.pick({ sid: true, s_grade: true, s_comment: true }),
});

module.exports.setup = (app) => {
  app.use("/api/teacher/submissions", router);

  router
    .route("/:sid")
    .get(
      validateRequest(getSubmissionId),
      submissionsController.getSubmissionById
    )
    .put(
      validateRequest(gradeSubmissionData),
      submissionsController.gradeSubmission
    )
    .all(allowedMethods(["GET", "PUT"]));
};
