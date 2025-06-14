const express = require("express");

const assignmentsController = require("../controllers/assignments.controller");
const submissionsController = require("../controllers/submissions.controller");
const allowedMethods = require("../middlewares/allowedMethods.middleware");

const router = express.Router();

module.exports.setup = (app) => {
  app.use("/api/assignments", router);

  router
    .route("/:id/submit")
    .post(submissionsController.createSubmission)
    .all(allowedMethods(["POST"]));

  router
    .route("/:id/submissions")
    .put(submissionsController.getSubmissions)
    .all(allowedMethods(["PUT"]));

  router
    .route("/:id")
    .get(assignmentsController.getAssignment)
    .put(assignmentsController.updateAssignment)
    .delete(assignmentsController.deleteAssignment)
    .all(allowedMethods(["GET", "PUT", "DELETE"]));
};
