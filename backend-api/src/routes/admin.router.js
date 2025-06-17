const express = require("express");
const { z } = require("zod");

const adminController = require("../controllers/admin.controller");
const allowedMethods = require("../middlewares/allowedMethods.middleware");
const { validateRequest } = require("../middlewares/validator.middleware");

const router = express.Router();

const getClassroomId = z.object({
  cid: z.coerce.number().nonnegative()
});

const getUserId = z.object({
  uid: z.coerce.number().nonnegative()
});

const getAssignmentId = z.object({
  aid: z.coerce.number().nonnegative()
});
module.exports.setup = (app) => {
  app.use("/api/admin", router);

  
  router
    .route("/overview")
    .get(adminController.overview)
    .all(allowedMethods(["GET"]));

 
  router
    .route("/users")
    .get(adminController.getAllUsers)
    .all(allowedMethods(["GET"]));

  
  router
    .route("/users/:id")
    .put(validateRequest(getUserId), adminController.toggleUserStatus)
    .all(allowedMethods(["PUT"]));

  
  router
    .route("/classrooms")
    .get(adminController.getAllClassrooms)
    .all(allowedMethods(["GET"]));

 
  router
    .route("/classrooms/:id")
    .put(validateRequest(getClassroomId), adminController.toggleClassroomStatus)
    .all(allowedMethods(["PUT"]));

 
  router
    .route("/assignments/:id")
    .put(validateRequest(getAssignmentId), adminController.toggleAssignmentStatus)
    .all(allowedMethods(["PUT"]));
};
