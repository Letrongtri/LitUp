const { unlink } = require("node:fs");
const knex = require("../database/knex");

function attachmentRepository() {
  return knex("attachments");
}

async function saveFile(file) {
  const fileData = {
    f_name: file.filename,
    f_original_name: file.originalname,
    f_type: file.mimetype,
    f_size: file.size,
  };

  const [result] = await attachmentRepository()
    .insert(fileData)
    .returning("fid");
  return { fid: result.fid, ...fileData };
}

function deleteFileByPath(filePath) {
  unlink(`.${filePath}`, () => {});
}

module.exports = { saveFile, deleteFileByPath };
