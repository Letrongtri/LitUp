function createSubmission(req, res) {
  return res.json({ submission: {} });
}

function getSubmissions(req, res) {
  return res.json({ Submissions: [] });
}

function getSubmission(req, res) {
  return res.json({ Submission: {} });
}

function updateSubmission(req, res) {
  return res.json({ Submission: {} });
}

function deleteSubmission(req, res) {
  return res.json({
    message: "Submission deleted",
  });
}

module.exports = {
  createSubmission,
  getSubmissions,
  getSubmission,
  updateSubmission,
  deleteSubmission,
};
