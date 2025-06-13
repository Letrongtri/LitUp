function createAssignment(req, res) {
  return res.json({ assignment: {} });
}

function getAssignments(req, res) {
  return res.json({ assignments: [] });
}

function getAssignment(req, res) {
  return res.json({ assignment: {} });
}

function updateAssignment(req, res) {
  return res.json({ assignment: {} });
}

function deleteAssignment(req, res) {
  return res.json({
    message: "Assignment deleted",
  });
}

module.exports = {
  createAssignment,
  getAssignments,
  getAssignment,
  updateAssignment,
  deleteAssignment,
};
