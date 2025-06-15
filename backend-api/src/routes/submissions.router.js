const express = require("express");
const { z } = require("zod");

const submissionsController = require("../controllers/submissions.controller");
const allowedMethods = require("../middlewares/allowedMethods.middleware");

// middlewares
const { validateRequest } = require("../middlewares/validator.middleware");

const router = express.Router();

/** Get Submission id */
const getSubmissionId = z.object({
  input: z
    .object({
      sid: z.coerce.number().nonnegative(),
    })
    .strict(),
});

module.exports.setup = (app) => {
  app.use("/api/submissions", router);

  router
    .route("/:sid")
    .get(validateRequest(getSubmissionId), submissionsController.getSubmission)
    .put(
      validateRequest(getSubmissionId),
      submissionsController.updateSubmission
    )
    .delete(
      validateRequest(getSubmissionId),
      submissionsController.deleteSubmission
    )
    .all(allowedMethods(["GET", "PUT", "DELETE"]));
};
