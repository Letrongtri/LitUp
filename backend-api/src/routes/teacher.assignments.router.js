const express = require("express");
const { z } = require("zod");

const assignmentsController = require("../controllers/assignments.controller");
const submissionsController = require("../controllers/submissions.controller");

// middlewares
const allowedMethods = require("../middlewares/allowedMethods.middleware");
const { validateRequest } = require("../middlewares/validator.middleware");
const { filesUpload } = require("../middlewares/files-upload.middleware");

// schema
const { partialAssignmentSchema } = require("../schemas/assignment.schemas");

const router = express.Router();

// Get assignment Id
const getAssignmentId = z.object({
  input: z
    .object({
      aid: z.coerce.number().nonnegative(),
    })
    .strict(),
});

/** Teacher update assignment */
const updateAssignmentData = z.object({
  input: partialAssignmentSchema
    .omit({ cid: true, a_created_at: true, a_updated_at: true })
    .refine(
      ({
        a_title,
        a_description,
        a_max_points,
        a_status,
        a_dealine_at,
        a_allow_late_submission,
        attachments,
      }) => {
        return (
          a_title ||
          a_description ||
          a_max_points ||
          a_status !== undefined ||
          a_dealine_at ||
          a_allow_late_submission !== undefined ||
          attachments
        );
      },
      {
        message: "At least one field is required",
      }
    ),
});

/** Teacher get assignment submissions */
const getSubmissionParams = z.object({
  input: z
    .object({
      aid: z.coerce.number().nonnegative(),
      limit: z.coerce.number().nonnegative().default(10),
      page: z.coerce.number().nonnegative().default(1),
    })
    .strict(),
});

module.exports.setup = (app) => {
  app.use("/api/teacher/assignments", router);

  router
    .route("/:aid/submissions")
    .get(
      validateRequest(getSubmissionParams),
      submissionsController.getSubmissions
    )
    .all(allowedMethods(["GET"]));

  router
    .route("/:aid")
    .get(validateRequest(getAssignmentId), assignmentsController.getAssignment)
    .put(
      [filesUpload, validateRequest(updateAssignmentData)],
      assignmentsController.updateAssignment
    )
    .delete(
      validateRequest(getAssignmentId),
      assignmentsController.deleteAssignment
    )
    .all(allowedMethods(["GET", "PUT", "DELETE"]));
};
