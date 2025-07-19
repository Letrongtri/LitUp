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

const getCreatedClassroomsData = z.object({
  uid: z.coerce.number().nonnegative().optional(),
  limit: z.coerce.number().nonnegative().optional(),
  page: z.coerce.number().nonnegative().optional(),
});

/** Teacher create a new classroom */
const createClassroomData = z.object({
  input: classroomSchema.pick({ c_name: true, uid: true }).strict(),
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

module.exports.setup = (app) => {
  app.use("/api/teacher/classrooms", router);

  router
    .route("/")
    .get(
      validateRequest(getCreatedClassroomsData),
      classroomsController.getTeacherClassrooms
    )
    .post(
      validateRequest(createClassroomData),
      classroomsController.createClassroom
    )
    .all(allowedMethods(["GET", "POST"]));

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
