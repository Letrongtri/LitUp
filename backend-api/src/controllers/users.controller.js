const usersService = require("../services/users.service");
const ApiError = require("../api-error");
const JSend = require("../jsend");

async function getUser(req, res, next) {
  const { uid } = req.params;

  try {
    const user = await usersService.getUserById(uid);

    if (!user) {
      return next(new ApiError(404, "User not found"));
    }

    return res.json(JSend.success({ user }));
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Internal Server Error"));
  }
}

async function updateUser(req, res, next) {
  const { uid } = req.params;

  try {
    const updated = await usersService.updateUser(uid, req.body, req.file);

    if (!updated) return next(new ApiError(404, "User not found"));

    return res.json(JSend.success({ updated }));
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Internal Server Error"));
  }
}

async function deleteUser(req, res, next) {
  const { uid } = req.params;

  try {
    const deleted = await usersService.deleteUser(uid);

    if (!deleted) return next(new ApiError(404, "User not found"));

    return res.json(JSend.success());
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Internal Server Error"));
  }
}

module.exports = {
  getUser,
  updateUser,
  deleteUser,
};
