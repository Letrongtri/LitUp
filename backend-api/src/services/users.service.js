const knex = require("../database/knex");
const { saveFile, deleteFiles } = require("./attachments.service");
const bcrypt = require("bcrypt");

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
    avatar_url: avatar ? `/uploads/${avatar.f_name}` : DEFAULT_AVATAR,
  };
}

async function updateUser(uid, updateData, file) {
  const trx = await knex.transaction();

  try {
    const updatedUser = await userRepository()
      .transacting(trx)
      .where("uid", uid)
      .select("*")
      .first();

    if (!updatedUser) {
      await trx.rollback();
      if (file) await deleteFiles([file]);
      return null;
    }

    const userData = readUserData(updateData);

    if (userData.u_password) {
      const hashedPassword = await bcrypt.hash(userData.u_password, 10);
      userData.u_password = hashedPassword;
    }

    let avatar_url = "/public/images/blank-profile-picture.png";
    let old_avatar = null;

    if (updatedUser.u_avatar_id) {
      old_avatar = await attachmentRepository()
        .transacting(trx)
        .where("fid", updatedUser.u_avatar_id)
        .first();

      if (old_avatar.f_name) {
        avatar_url = `/uploads/${old_avatar.f_name}`;
      }
    }

    if (file) {
      const avatar = await saveFile(file, trx);
      userData.u_avatar_id = avatar.fid;
      avatar_url = `/uploads/${avatar.f_name}`;

      if (old_avatar?.f_name) {
        await attachmentRepository()
          .transacting(trx)
          .where("fid", old_avatar.fid)
          .delete();
      }
    }

    // Nếu có ít nhất một trường cần cập nhật, thực hiện truy vấn UPDATE
    if (Object.keys(userData).length > 0) {
      userData.u_updated_at = new Date().toISOString();
      await userRepository()
        .transacting(trx)
        .where("uid", uid)
        .update(userData);
    }

    await trx.commit();

    if (old_avatar?.f_name) {
      await deleteFiles([`/uploads/${old_avatar.f_name}`]);
    }

    return {
      ...updatedUser,
      ...userData,
      avatar_url,
    };
  } catch (error) {
    await trx.rollback();
    if (file) await deleteFiles([file]);
    throw error;
  }
}

async function deleteUser(uid) {
  const trx = await knex.transaction();
  try {
    const deletedUser = await userRepository()
      .transacting(trx)
      .where("uid", uid)
      .select("u_email", "u_avatar_id")
      .first();

    if (!deletedUser) return null;

    await userRepository().transacting(trx).where("uid", uid).del();

    // Nếu có avatar cũ → xóa
    let oldAvatar = null;
    if (deletedUser.u_avatar_id) {
      oldAvatar = await attachmentRepository()
        .transacting(trx)
        .where("fid", deletedUser.u_avatar_id)
        .first();

      if (oldAvatar?.f_name) {
        await attachmentRepository()
          .transacting(trx)
          .where("fid", deletedUser.u_avatar_id)
          .delete();
      }
    }

    await trx.commit();

    if (oldAvatar?.f_name) {
      await deleteFiles([`uploads/${oldAvatar.f_name}`]);
    }
    return deletedUser;
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}

module.exports = {
  getUserById,
  updateUser,
  deleteUser,
};
