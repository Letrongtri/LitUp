const express = require("express");
const { z } = require("zod");

// controllers
const classroomsController = require("../controllers/classrooms.controller");
const assignmentsController = require("../controllers/assignments.controller");

// middlewares
const allowedMethods = require("../middlewares/allowedMethods.middleware");
const { validateRequest } = require("../middlewares/validator.middleware");
const { filesUpload } = require("../middlewares/files-upload.middleware");

// schema
const {
  classroomSchema,
  partialClassroomSchema,
} = require("../schemas/classroom.schemas");
const { assignmentSchema } = require("../schemas/assignment.schemas");

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

/** Teacher create a new classroom */
const createClassroomData = z.object({
  input: classroomSchema.pick({ c_name: true, uid: true }).strict(),
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

/** Teacher update classroom */
const updateClassroomData = z.object({
  input: partialClassroomSchema
    .omit({ c_code: true, c_created_at: true, c_updated_at: true })
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
  input: assignmentSchema
    .omit({ aid: true, a_created_at: true, a_updated_at: true })
    .strict(),
});

/** Get list of assignments */
const getAssignmentsData = z.object({
  input: z.object({
    cid: z.coerce.number().nonnegative(),
  }),
});

const getTeacherClassroomQuery = z.object({
  input: z.object({
    uid: z.coerce.number().nonnegative(),
    role: z.literal("teacher"),
    limit: z.coerce.number().optional(),
    page: z.coerce.number().optional(),
  }),
});

module.exports.setup = (app) => {
  app.use("/api/classrooms", router);

  router
    .route("/teacher")
    .get(
      validateRequest(getTeacherClassroomQuery),
      classroomsController.getTeacherClassrooms
    )
    .all(allowedMethods(["GET"]));

  router
    .route("/")
    .post(
      validateRequest(createClassroomData),
      classroomsController.createClassroom
    )
    .get(
      validateRequest(getJoinedClassroomData),
      classroomsController.getJoinedClassrooms
    )
    .all(allowedMethods(["POST", "GET"]));

  router
    .route("/:cid")
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
    .route("/:cid/join")
    .post(
      validateRequest(joinClassroomData),
      classroomsController.joinClassroom
    )
    .all(allowedMethods(["POST"]));

  router
    .route("/:cid/members")
    .get(
      validateRequest(getClassroomId),
      classroomsController.getMembersInClass
    )
    .all(allowedMethods(["GET"]));

  router
    .route("/:cid/assignments")
    .post(
      [filesUpload, validateRequest(createAssignmentData)],
      assignmentsController.createAssignment
    )
    .get(
      validateRequest(getAssignmentsData),
      assignmentsController.getAssignments
    )
    .all(allowedMethods(["POST", "GET"]));
};
