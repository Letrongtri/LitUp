const express = require("express");
const { z } = require("zod");

const assignmentsController = require("../controllers/assignments.controller");
const submissionsController = require("../controllers/submissions.controller");

// middlewares
const allowedMethods = require("../middlewares/allowedMethods.middleware");
const { validateRequest } = require("../middlewares/validator.middleware");

// schema
const {
  // assignmentSchema,
  partialAssignmentSchema,
} = require("../schemas/assignment.schemas");
const {
  submissionSchema,
  // partialSubmissionSchema,
} = require("../schemas/submission.schemas");

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
    .strict()
    .refine(
      ({
        a_title,
        a_description,
        a_max_points,
        a_dealine_at,
        a_allow_late_submission,
      }) => {
        return (
          a_title ||
          a_description ||
          a_max_points ||
          a_dealine_at ||
          a_allow_late_submission
        );
      },
      {
        message: "At least one field is required",
      }
    ),
});

/** Student create a new submission */
const createSubmissionData = z.object({
  input: submissionSchema.pick({ sid: true }).strict(),
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
  app.use("/api/assignments", router);

  router
    .route("/:aid/submit")
    .post(
      validateRequest(createSubmissionData),
      submissionsController.createSubmission
    )
    .all(allowedMethods(["POST"]));

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
      validateRequest(updateAssignmentData),
      assignmentsController.updateAssignment
    )
    .delete(
      validateRequest(getAssignmentId),
      assignmentsController.deleteAssignment
    )
    .all(allowedMethods(["GET", "PUT", "DELETE"]));
};
