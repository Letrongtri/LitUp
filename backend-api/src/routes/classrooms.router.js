const express = require("express");

const classroomsController = require("../controllers/classrooms.controller");
const assignmentsController = require("../controllers/assignments.controller");
const allowedMethods = require("../middlewares/allowedMethods.middleware");

const router = express.Router();

module.exports.setup = (app) => {
  app.use("/api/classrooms", router);

  router
    .route("/")
    .post(classroomsController.createClassroom)
    .get(classroomsController.getClassrooms)
    .all(allowedMethods(["POST", "GET"]));

  router
    .route("/join")
    .post(classroomsController.joinClassroom)
    .all(allowedMethods(["POST"]));

  router
    .route("/:id")
    .get(classroomsController.getClassroom)
    .put(classroomsController.updateClassroom)
    .delete(classroomsController.deleteClassroom)
    .all(allowedMethods(["GET", "PUT", "DELETE"]));

  router
    .route("/:id/members")
    .get(classroomsController.getMembersInClass)
    .all(allowedMethods(["GET"]));

  router
    .route("/:id/assignments")
    .post(assignmentsController.createAssignment)
    .get(assignmentsController.getAssignments)
    .all(allowedMethods(["POST", "GET"]));
};
