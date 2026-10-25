const { deleteFiles } = require("../services/attachments.service");

function cleanupUploadOnError(err, req, res, next) {
  const files = req.files || (req.file ? [req.file] : []);
  if (files.length > 0) {
    deleteFiles(files).catch(() => {});
  }
  next(err);
}

module.exports = cleanupUploadOnError;
