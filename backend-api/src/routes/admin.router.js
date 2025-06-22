const express = require("express");
const { z } = require("zod");

const adminController = require("../controllers/admin.controller");
const allowedMethods = require("../middlewares/allowedMethods.middleware");
const { validateRequest } = require("../middlewares/validator.middleware");

const router = express.Router();

// Zod schemas
const getClassroomId = z.object({
  input: z.object({
    cid: z.coerce.number().nonnegative()
  })
});

const getUserId = z.object({
  input: z.object({
    uid: z.coerce.number().nonnegative()
  })
});

const getAssignmentId = z.object({
  input: z.object({
    aid: z.coerce.number().nonnegative()
  })
});

const toggleUserStatusBody = z.object({
  input: z.object({
    u_status: z.boolean()
  })
});


const toggleAssigmentStatusBody = z.object({
  input: z.object({
    a_status: z.boolean()
  })
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
      validateRequest(getUserId),              
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
    .put(validateRequest(getClassroomId), adminController.toggleClassroomStatus)
    .all(allowedMethods(["PUT"]));

  // Assignments
  router
  .route("/assignments/:aid")
  .put(
    validateRequest(getAssignmentId),              
    validateRequest(toggleAssigmentStatusBody),   
    adminController.toggleAssignmentStatus
  )
  .all(allowedMethods(["PUT"]));
};
