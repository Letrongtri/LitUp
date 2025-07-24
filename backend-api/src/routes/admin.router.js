const express = require("express");
const { z } = require("zod");

const adminController = require("../controllers/admin.controller");
const allowedMethods = require("../middlewares/allowedMethods.middleware");
const { validateRequest } = require("../middlewares/validator.middleware");

const router = express.Router();

// Zod schemas
const toggleClassroomStatusBody = z.object({
  input: z.object({
    cid: z.coerce.number().nonnegative(),
    c_status: z.boolean(),
  }),
});

const toggleUserStatusBody = z.object({
  input: z.object({
    uid: z.coerce.number().nonnegative(),
    u_status: z.boolean(),
  }),
});

const toggleAssigmentStatusBody = z.object({
  input: z.object({
    aid: z.coerce.number().nonnegative(),
    a_status: z.boolean(),
  }),
});

module.exports.setup = (app) => {
  app.use("/api/admin", router);

  // Overview
  router
    .route("/overview")
    .get(adminController.overview)
    .all(allowedMethods(["GET"]));

  // Users
  router
    .route("/users")
    .get(adminController.getAllUsers)
    .all(allowedMethods(["GET"]));

  router
    .route("/users/:uid")
    .put(
      validateRequest(toggleUserStatusBody),
      adminController.toggleUserStatus
    )
    .all(allowedMethods(["PUT"]));

  // Classrooms
  router
    .route("/classrooms")
    .get(adminController.getAllClassrooms)
    .all(allowedMethods(["GET"]));

  router
    .route("/classrooms/:cid")
    .put(
      validateRequest(toggleClassroomStatusBody),
      adminController.toggleClassroomStatus
    )
    .all(allowedMethods(["PUT"]));

  // Assignments
  router
    .route("/assignments")
    .get(adminController.getAllAssignments)
    .all(allowedMethods(["GET"]));

  router
    .route("/assignments/:aid")
    .put(
      validateRequest(toggleAssigmentStatusBody),
      adminController.toggleAssignmentStatus
    )
    .all(allowedMethods(["PUT"]));

  // Submissions
  router
    .route("/submissions")
    .get(adminController.getAllSubmissions)
    .all(allowedMethods(["GET"]));
};
