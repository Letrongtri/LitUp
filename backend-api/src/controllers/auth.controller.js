const authService = require("../services/auth.service");
const ApiError = require("../api-error");
const JSend = require("../jsend");

async function register(req, res, next) {
  try {
    const userData = { ...req.body };

    const user = await authService.createUser(userData);

    return res
      .status(201)
      .set({ Location: `${req.baseUrl}/${user.uid}` })
      .json(JSend.success({ user }));
  } catch (error) {
    if (error.statusCode)
      return next(new ApiError(error.statusCode, error.message));

    console.log(error);
    return next(new ApiError(500, "Internal Server Error"));
  }
}

async function login(req, res, next) {
  try {
    const userData = { ...req.body };

    const user = await authService.loginUser(userData);

    return res.json(JSend.success({ user }));
  } catch (error) {
    if (error.statusCode)
      return next(new ApiError(error.statusCode, error.message));
    console.log(error);
    return next(new ApiError(500, "Internal Server Error"));
  }
}

module.exports = {
  register,
  login,
};
