const express = require("express");
const { z } = require("zod");

const usersController = require("../controllers/users.controller");

// middlewares
const allowedMethods = require("../middlewares/allowedMethods.middleware");
const { validateRequest } = require("../middlewares/validator.middleware");
const { avatarUpload } = require("../middlewares/avatar-upload.middleware");

// schema
const { partialUserSchema } = require("../schemas/user.schemas");

const router = express.Router();

/** User update profile */
const updateUserData = z.object({
  input: partialUserSchema.omit({ u_role: true, c_created_at: true }).refine(
    ({
      u_email,
      u_first_name,
      u_last_name,
      u_password,
      u_status,
      u_avatar_file,
    }) => {
      return (
        u_email ||
        u_first_name ||
        u_last_name ||
        u_password ||
        u_status !== undefined ||
        u_avatar_file
      );
    },
    {
      message: "At least one field is required",
    }
  ),
});

/** User id */
const getUserID = z.object({
  input: z
    .object({
      uid: z.coerce.number().nonnegative(),
    })
    .strict(),
});

module.exports.setup = (app) => {
  app.use("/api/users", router);

  router
    .route("/:uid")
    .get(validateRequest(getUserID), usersController.getUser)
    .put(
      [avatarUpload, validateRequest(updateUserData)],
      usersController.updateUser
    )
    .delete(usersController.deleteUser)
    .all(allowedMethods(["GET", "PUT", "DELETE"]));
};
