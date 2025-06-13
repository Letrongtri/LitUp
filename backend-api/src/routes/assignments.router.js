const express = require("express");

const assignmentsController = require("../controllers/assignments.controller");
const submissionsController = require("../controllers/submissions.controller");

const router = express.Router();

module.exports.setup = (app) => {
  app.use("/api/assignments", router);

  router.post("/:id/submit", submissionsController.createSubmission);
  router.put("/:id/submissions", submissionsController.getSubmissions);

  router.get("/:id", assignmentsController.getAssignment);
  router.put("/:id", assignmentsController.updateAssignment);
  router.delete("/:id", assignmentsController.deleteAssignment);
};
