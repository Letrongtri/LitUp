const express = require("express");

const usersController = require("../controllers/users.controller");

const router = express.Router();

module.exports.setup = (app) => {
  app.use("/api/users", router);

  router.get("/", usersController.getUser);
  router.put("/:id", usersController.updateUser);
  router.delete("/:id", usersController.deleteUser);
};
