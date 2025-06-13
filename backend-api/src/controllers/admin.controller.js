function overview(req, res) {
  return res.json({
    users: {},
    classrooms: {},
    assignments: {},
    submissions: {},
    assignment: {},
  });
}

function getUsers(req, res) {
  return res.json({ users: [] });
}

function updateUser(req, res) {
  return res.json({ user: {} });
}

function getClassrooms(req, res) {
  return res.json({ classrooms: [] });
}

function updateClassroom(req, res) {
  return res.json({ Classroom: {} });
}

function updateAssignment(req, res) {
  return res.json({ assignment: {} });
}

module.exports = {
  overview,
  getUsers,
  updateUser,
  getClassrooms,
  updateClassroom,
  updateAssignment,
};
