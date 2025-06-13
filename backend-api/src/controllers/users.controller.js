function getUser(req, res) {
  return res.json({ contact: {} });
}

function updateUser(req, res) {
  return res.json({ user: {} });
}

function deleteUser(req, res) {
  return res.json({
    message: "User deleted",
  });
}

module.exports = {
  getUser,
  updateUser,
  deleteUser,
};
