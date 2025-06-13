const express = require("express");

const adminController = require("../controllers/admin.controller");

const router = express.Router();

module.exports.setup = (app) => {
  app.use("/api/admin", router);

  router.get("/overview", adminController.overview);

  router.get("/users", adminController.getUsers);
  router.put("/users/:id", adminController.updateUser);

  router.get("/classrooms", adminController.getClassrooms);
  router.put("/classrooms/:id", adminController.updateClassroom);

  router.put("/assignments/:id", adminController.updateAssignment);
};
