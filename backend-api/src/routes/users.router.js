const express = require("express");

const usersController = require("../controllers/users.controller");
const allowedMethods = require("../middlewares/allowedMethods.middleware");

const router = express.Router();

module.exports.setup = (app) => {
  app.use("/api/users", router);

  router
    .route("/")
    .get(usersController.getUser)
    .all(allowedMethods(["GET"]));

  router
    .route("/:id")
    .put(usersController.updateUser)
    .delete(usersController.deleteUser)
    .all(allowedMethods(["PUT", "DELETE"]));
};
