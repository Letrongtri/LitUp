const JSend = require("../jsend");

function getUser(req, res) {
  return res.status(201).json(JSend.success({ user: {} }));
}

function updateUser(req, res) {
  return res.status(201).json(JSend.success({ users: {} }));
}

function deleteUser(req, res) {
  return res.status(201).json(JSend.success());
}

module.exports = {
  getUser,
  updateUser,
  deleteUser,
};
