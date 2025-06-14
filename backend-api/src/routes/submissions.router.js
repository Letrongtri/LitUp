const express = require("express");

const submissionsController = require("../controllers/submissions.controller");
const allowedMethods = require("../middlewares/allowedMethods.middleware");

const router = express.Router();

module.exports.setup = (app) => {
  app.use("/api/submissions", router);

  router
    .route("/:id")
    .get(submissionsController.getSubmission)
    .put(submissionsController.updateSubmission)
    .delete(submissionsController.deleteSubmission)
    .all(allowedMethods(["GET", "PUT", "DELETE"]));

};
