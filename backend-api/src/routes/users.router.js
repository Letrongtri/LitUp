const express = require("express");
const { z } = require("zod");

const usersController = require("../controllers/users.controller");

// middlewares
const allowedMethods = require("../middlewares/allowedMethods.middleware");
const { validateRequest } = require("../middlewares/validator.middleware");

// schema
const { partialUserSchema } = require("../schemas/user.schemas");

const router = express.Router();

/** User update profile */
const updateUserData = z.object({
  input: partialUserSchema
    .omit({ u_role: true, c_created_at: true })
    .strict()
    .refine(
      ({ u_email, u_first_name, u_last_name, u_password, u_status }) => {
        return (
          u_email ||
          u_first_name ||
          u_last_name ||
          u_password ||
          u_status !== undefined
        );
      },
      {
        message: "At least one field is required",
      }
    ),
});

module.exports.setup = (app) => {
  app.use("/api/users", router);

  router
    .route("/")
    .get(usersController.getUser)
    .all(allowedMethods(["GET"]));

  router
    .route("/:uid")
    .put(validateRequest(updateUserData), usersController.updateUser)
    .delete(usersController.deleteUser)
    .all(allowedMethods(["PUT", "DELETE"]));
};
