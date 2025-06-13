const JSend = require("../jsend");

function register(req, res) {
  return res.status(201).json(JSend.success({ user: {} }));
}

function login(req, res) {
  return res.status(201).json(JSend.success({ user: {} }));
}

module.exports = {
  register,
  login,
};
