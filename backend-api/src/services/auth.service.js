const ApiError = require("../api-error");
const knex = require("../database/knex");
const bcrypt = require("bcrypt");

/**
 * @import { z } from 'zod';
 * @import {
 * userSchema,
 * partialUserSchema,
 * } from ' ./schemas/user.schemas';
 * @typedef {z.infer<typeof userSchema>} User
 * @typedef {z.infer<typeof partialUserSchema>} PartialUser
 */
function userRepository() {
  return knex("users");
}

function attachmentRepository() {
  return knex("attachments");
}

// Define functions for accessing the database

/**
 * @param {Object} payload
 * @returns {Promise<User>}
 */
async function createUser(payload) {
  const data = {
    ...(payload.u_email ? { u_email: payload.u_email } : {}),
    ...(payload.u_first_name ? { u_first_name: payload.u_first_name } : {}),
    ...(payload.u_last_name ? { u_last_name: payload.u_last_name } : {}),
    ...(payload.u_role ? { u_role: payload.u_role } : {}),
  };

  // check email
  const existtingEmail = await userRepository()
    .where({ u_email: data.u_email })
    .first();

  if (existtingEmail) {
    throw new ApiError(409, "Email already exists");
  }

  //   hash pw
  const hashedPassword = await bcrypt.hash(payload.u_password, 10);
  const userData = {
    ...data,
    u_password: hashedPassword,
  };

  const [result] = await userRepository().insert(userData).returning("uid");
  return { uid: result.uid, ...userData };
}

/**
 * @param {Object} payload
 * @returns {Promise<User>}
 */
async function loginUser(payload) {
  const u_email = payload.u_email;
  const inputPassword = payload.u_password;

  const user = await userRepository().where({ u_email }).first();

  const isMatch = await bcrypt.compare(inputPassword, user.u_password);

  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  const avatar = user.u_avatar_id
    ? await attachmentRepository().where("fid", user.u_avatar_id).first()
    : null;

  const DEFAULT_AVATAR = "/public/images/blank-profile-picture.png";

  return {
    ...user,
    avatar_url: avatar ? `/public/uploads/${avatar.f_name}` : DEFAULT_AVATAR,
  };

  // return { user };
}

module.exports = {
  createUser,
  loginUser,
};
