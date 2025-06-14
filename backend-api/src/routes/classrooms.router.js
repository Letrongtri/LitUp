const express = require("express");
const { z } = require("zod");

// controllers
const classroomsController = require("../controllers/classrooms.controller");
const assignmentsController = require("../controllers/assignments.controller");

// middlewares
const allowedMethods = require("../middlewares/allowedMethods.middleware");
const { validateRequest } = require("../middlewares/validator.middleware");

// schema
const {
  classroomSchema,
  partialClassroomSchema,
} = require("../schemas/classroom.schemas");
const { memberSchema } = require("../schemas/member.schemas");
const { assignmentSchema } = require("../schemas/assignment.schemas");

const router = express.Router();

/**
 * Get list of classroom student has joined
 * query: ?limit=10&page=2
 */
const getClassroomsParams = z.object({
  input: z
    .object({
      limit: z.coerce.number().nonnegative().default(5),
      page: z.coerce.number().nonnegative().default(1),
    })
    .strict(),
});

/** Teacher create a new classroom */
const createClassroomData = z.object({
  input: classroomSchema
    .omit({ cid: true, c_code: true, c_updated_at: true })
    .strict(),
});

/** Student joins classroom */
const joinClassroomData = z.object({
  input: memberSchema.omit({ m_removed_at: true }).strict(),
});

/** Get classroom id */
const getClassroomId = z.object({
  input: classroomSchema.pick({ cid: true }).strict(),
});

/** Teacher update classroom */
const updateClassroomData = z.object({
  input: partialClassroomSchema
    .omit({ c_code: true, c_created_at: true })
    .strict()
    .refine(
      ({ c_name, c_status }) => {
        return c_name || c_status !== undefined;
      },
      {
        message: "At least one field is required",
      }
    ),
});

/** Teacher create a new assignment */
const createAssignmentData = z.object({
  input: assignmentSchema.omit({ cid: true, c_updated_at: true }).strict(),
});

module.exports.setup = (app) => {
  app.use("/api/classrooms", router);

  router
    .route("/")
    .post(
      validateRequest(createClassroomData),
      classroomsController.createClassroom
    )
    .get(
      validateRequest(getClassroomsParams),
      classroomsController.getClassrooms
    )
    .all(allowedMethods(["POST", "GET"]));

  router
    .route("/join")
    .post(
      validateRequest(joinClassroomData),
      classroomsController.joinClassroom
    )
    .all(allowedMethods(["POST"]));

  router
    .route("/:id")
    .get(validateRequest(getClassroomId), classroomsController.getClassroom)
    .put(
      validateRequest(updateClassroomData),
      classroomsController.updateClassroom
    )
    .delete(
      validateRequest(getClassroomId),
      classroomsController.deleteClassroom
    )
    .all(allowedMethods(["GET", "PUT", "DELETE"]));

  router
    .route("/:id/members")
    .get(
      validateRequest(getClassroomId),
      classroomsController.getMembersInClass
    )
    .all(allowedMethods(["GET"]));

  router
    .route("/:id/assignments")
    .post(
      validateRequest(createAssignmentData),
      assignmentsController.createAssignment
    )
    .get(validateRequest(getClassroomId), assignmentsController.getAssignments)
    .all(allowedMethods(["POST", "GET"]));
};
