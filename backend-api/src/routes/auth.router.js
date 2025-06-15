const express = require("express");
const { z } = require("zod");

// controllers
const authController = require("../controllers/auth.controller");

// middlewares
const allowedMethods = require("../middlewares/allowedMethods.middleware");
const { validateRequest } = require("../middlewares/validator.middleware");

// schema
const { userSchema } = require("../schemas/user.schemas");

const router = express.Router();

/** Register a new user account */
const registerData = z.object({
  input: userSchema
    .omit({
      uid: true,
      u_avatar_id: true,
      u_created_at: true,
      u_updated_at: true,
    })
    .strict(),
});

/** Login an existed user account */
const loginData = z.object({
  input: userSchema
    .pick({
      u_email: true,
      u_password: true,
    })
    .strict(),
});

module.exports.setup = (app) => {
  app.use("/api/auth", router);

  router
    .route("/register")
    .post(validateRequest(registerData), authController.register)
    .all(allowedMethods(["POST"]));

  router
    .route("/login")
    .post(validateRequest(loginData), authController.login)
    .all(allowedMethods(["POST"]));
};
