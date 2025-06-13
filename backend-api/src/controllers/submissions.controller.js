const JSend = require("../jsend");

function createSubmission(req, res) {
  return res.status(201).json(JSend.success({ submission: {} }));
}

function getSubmissions(req, res) {
  return res.status(201).json(JSend.success({ submissions: [] }));
}

function getSubmission(req, res) {
  return res.status(201).json(JSend.success({ submission: {} }));
}

function updateSubmission(req, res) {
  return res.status(201).json(JSend.success({ submission: {} }));
}

function deleteSubmission(req, res) {
  return res.status(201).json(JSend.success());
}

module.exports = {
  createSubmission,
  getSubmissions,
  getSubmission,
  updateSubmission,
  deleteSubmission,
};
