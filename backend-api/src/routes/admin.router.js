const express = require("express");

const adminController = require("../controllers/admin.controller");
const allowedMethods = require("../middlewares/allowedMethods.middleware");

const router = express.Router();

module.exports.setup = (app) => {
  app.use("/api/admin", router);

  router
    .route("/overview")
    .get(adminController.overview)
    .all(allowedMethods(["GET"]));

  router
    .route("/users")
    .get(adminController.getUsers)
    .all(allowedMethods(["GET"]));

  router
    .route("/users/:id")
    .put(adminController.updateUser)
    .all(allowedMethods(["PUT"]));

  router
    .route("/classrooms")
    .get(adminController.getClassrooms)
    .all(allowedMethods(["GET"]));

  router
    .route("/classrooms/:id")
    .put(adminController.updateClassroom)
    .all(allowedMethods(["PUT"]));

  router
    .route("/assignments/:id")
    .put(adminController.updateAssignment)
    .all(allowedMethods(["PUT"]));
};
