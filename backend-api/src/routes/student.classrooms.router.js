const express = require("express");
const { z } = require("zod");

// controllers
const classroomsController = require("../controllers/classrooms.controller");
const assignmentsController = require("../controllers/assignments.controller");

// middlewares
const allowedMethods = require("../middlewares/allowedMethods.middleware");
const { validateRequest } = require("../middlewares/validator.middleware");

const router = express.Router();

/**
 * Get list of classroom student has joined
 * query: ?uid=15&limit=10&page=2
 */
const getJoinedClassroomData = z.object({
  uid: z.coerce.number().nonnegative().optional(),
  limit: z.coerce.number().nonnegative().optional(),
  page: z.coerce.number().nonnegative().optional(),
});

/** Student joins classroom */
const joinClassroomData = z.object({
  input: z.object({
    cid: z.coerce.number().nonnegative(),
    c_code: z.string().length(6),
    uid: z.coerce.number().nonnegative(),
  }),
});

/** Get classroom id */
const getClassroomId = z.object({
  input: z.object({
    cid: z.coerce.number().nonnegative(),
  }),
});

/** Get list of assignments */
const getAssignmentsData = z.object({
  input: z.object({
    cid: z.coerce.number().nonnegative(),
  }),
});

module.exports.setup = (app) => {
  app.use("/api/student/classrooms", router);

  router
    .route("/")
    .get(
      validateRequest(getJoinedClassroomData),
      classroomsController.getJoinedClassrooms
    )
    .all(allowedMethods(["GET"]));

  router
    .route("/:cid")
    .get(
      validateRequest(getClassroomId),
      classroomsController.getClassroomDetailByStudent
    )
    .post(
      validateRequest(joinClassroomData),
      classroomsController.joinClassroom
    )
    .all(allowedMethods(["GET", "POST"]));

  router
    .route("/:cid/assignments")
    .get(
      validateRequest(getAssignmentsData),
      assignmentsController.getAssignments
    )
    .all(allowedMethods(["GET"]));
};
