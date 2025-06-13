function register(req, res) {
  return res.status(201).json({ user: {} });
}

function login(req, res) {
  return res.status(201).json({ user: {} });
}

module.exports = {
  register,
  login,
};
