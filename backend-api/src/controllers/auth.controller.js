const authService = require("../services/auth.service");
const ApiError = require("../api-error");
const JSend = require("../jsend");
const jwt = require("jsonwebtoken");

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

    if (
      typeof userData.u_email !== "string" ||
      typeof userData.u_password !== "string"
    ) {
      return res.status(400).json({ error: "Email/password must be provided" });
    }

    const user = await authService.loginUser(userData);

    const token = jwt.sign(user, process.env.JWT_SECRET);

    return res.json(JSend.success({ token }));
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
