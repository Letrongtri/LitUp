const knex = require("../database/knex");
const { saveFile, deleteFileByPath } = require("./attachments.service");

function userRepository() {
  return knex("users");
}

function attachmentRepository() {
  return knex("attachments");
}

function readUserData(payload) {
  return {
    ...(payload.u_email ? { u_email: payload.u_email } : {}),
    ...(payload.u_first_name ? { u_first_name: payload.u_first_name } : {}),
    ...(payload.u_last_name ? { u_last_name: payload.u_last_name } : {}),
    ...(payload.u_password ? { u_password: payload.u_password } : {}),
    ...(payload.u_status !== undefined && { u_status: payload.u_status }),
  };
}

// Define functions for accessing the database

async function getUserById(uid) {
  const user = await userRepository().where("uid", uid).select("*").first();

  if (!user) {
    return null;
  }

  const avatar = user.u_avatar_id
    ? await attachmentRepository().where("fid", user.u_avatar_id).first()
    : null;

  const DEFAULT_AVATAR = "/public/images/blank-profile-picture.png";

  return {
    ...user,
    avatar_url: avatar ? `/public/uploads/${avatar.f_name}` : DEFAULT_AVATAR,
  };
}

async function updateUser(uid, updateData, file) {
  const updatedUser = await userRepository()
    .where("uid", uid)
    .select("*")
    .first();

  if (!updatedUser) return null;

  const userData = readUserData(updateData);

  if (file) {
    const avatar = await saveFile(file);
    userData.u_avatar_id = avatar.fid;
  }

  // Nếu có avatar cũ → xóa
  if (updatedUser.u_avatar_id) {
    const oldAvatar = await attachmentRepository()
      .where("fid", updatedUser.u_avatar_id)
      .first();

    if (oldAvatar?.f_name) {
      deleteFileByPath(`public/uploads/${oldAvatar.f_name}`);
      await attachmentRepository()
        .where("fid", updatedUser.u_avatar_id)
        .delete();
    }
  }

  // Nếu có ít nhất một trường cần cập nhật, thực hiện truy vấn UPDATE
  if (Object.keys(userData).length > 0) {
    await userRepository().where("uid", uid).update(userData);
  }

  return { ...updatedUser, ...userData };
}

async function deleteUser(uid) {
  const deletedUser = await userRepository()
    .where("uid", uid)
    .select("u_email", "u_avatar_id")
    .first();

  if (!deletedUser) return null;

  await userRepository().where("uid", uid).del();

  // Nếu có avatar cũ → xóa
  if (deletedUser.u_avatar_id) {
    const oldAvatar = await attachmentRepository()
      .where("fid", deletedUser.u_avatar_id)
      .first();

    if (oldAvatar?.f_name) {
      deleteFileByPath(`/public/uploads/${oldAvatar.f_name}`);
      await attachmentRepository()
        .where("fid", deletedUser.u_avatar_id)
        .delete();
    }
  }

  return deleteUser;
}

module.exports = {
  getUserById,
  updateUser,
  deleteUser,
};
