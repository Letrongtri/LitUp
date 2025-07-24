const express = require("express");
const { z } = require("zod");

const assignmentsController = require("../controllers/assignments.controller");
const submissionsController = require("../controllers/submissions.controller");

// middlewares
const allowedMethods = require("../middlewares/allowedMethods.middleware");
const { validateRequest } = require("../middlewares/validator.middleware");
const { filesUpload } = require("../middlewares/files-upload.middleware");

// schema
const { submissionSchema } = require("../schemas/submission.schemas");

const router = express.Router();

// Get assignment Id
const getAssignmentId = z.object({
  input: z
    .object({
      aid: z.coerce.number().nonnegative(),
    })
    .strict(),
});

/** Student create a new submission */
const createSubmissionData = z.object({
  input: submissionSchema
    .pick({ aid: true, uid: true, attachments: true })
    .strict(),
});

module.exports.setup = (app) => {
  app.use("/api/student/assignments", router);

  router
    .route("/:aid")
    .get(validateRequest(getAssignmentId), assignmentsController.getAssignment)
    .post(
      [filesUpload, validateRequest(createSubmissionData)],
      submissionsController.createSubmission
    )
    .all(allowedMethods(["GET", "POST"]));
};
