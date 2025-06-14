const express = require("express");

const authController = require("../controllers/auth.controller");
const allowedMethods = require("../middlewares/allowedMethods.middleware");

const router = express.Router();

module.exports.setup = (app) => {
  app.use("/api/auth", router);

  router
    .route("/register")
    .post(authController.register)
    .all(allowedMethods(["POST"]));

  router
    .route("/login")
    .post(authController.login)
    .all(allowedMethods(["POST"]));
};
