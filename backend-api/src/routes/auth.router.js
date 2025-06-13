const express = require("express");

const authController = require("../controllers/auth.controller");

const router = express.Router();

module.exports.setup = (app) => {
  app.use("/api/auth", router);

  router.post("/register", authController.register);
  router.post("/login", authController.login);
};
