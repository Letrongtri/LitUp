const express = require("express");

const classroomsController = require("../controllers/classrooms.controller");
const assignmentsController = require("../controllers/assignments.controller");

const router = express.Router();

module.exports.setup = (app) => {
  app.use("/api/classrooms", router);

  router.post("/", classroomsController.createClassroom);
  router.get("/", classroomsController.getClassrooms);

  router.post("/join", classroomsController.joinClassroom);

  router.get("/:id", classroomsController.getClassroom);
  router.get("/:id/members", classroomsController.getMembersInClass);
  router.put("/:id", classroomsController.updateClassroom);
  router.delete("/:id", classroomsController.deleteClassroom);

  router.post("/:id/assignments", assignmentsController.createAssignment);
  router.get("/:id/assignments", assignmentsController.getAssignments);
};
