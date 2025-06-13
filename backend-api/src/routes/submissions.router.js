const express = require("express");

const submissionsController = require("../controllers/submissions.controller");

const router = express.Router();

module.exports.setup = (app) => {
  app.use("/api/submissions", router);

  router.get("/:id", submissionsController.getSubmission);
  router.put("/:id", submissionsController.updateSubmission);
  router.delete("/:id", submissionsController.deleteSubmission);
};
