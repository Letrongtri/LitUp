const usersService = require("../services/users.service");
const ApiError = require("../api-error");
const JSend = require("../jsend");

async function fetchMe(req, res, next) {
  try {
    const user = await usersService.getUserById(req.user.uid);

    return res.json(JSend.success({ user }));
  } catch (error) {
    if (error.statusCode)
      return next(new ApiError(error.statusCode, error.message));
    console.log(error);
    return next(new ApiError(500, "Internal Server Error"));
  }
}

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
  try {
    const user = await usersService.updateUser(
      req.user.uid,
      req.body,
      req.file
    );

    if (!user) return next(new ApiError(404, "User not found"));

    return res.json(JSend.success({ user }));
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Internal Server Error"));
  }
}

async function deleteUser(req, res, next) {
  try {
    const deleted = await usersService.deleteUser(req.user.uid);

    if (!deleted) return next(new ApiError(404, "User not found"));

    return res.json(JSend.success());
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Internal Server Error"));
  }
}

module.exports = {
  fetchMe,
  getUser,
  updateUser,
  deleteUser,
};
