const { unlink } = require("node:fs/promises");
const path = require("node:path");
const knex = require("../database/knex");

function attachmentRepository() {
  return knex("attachments");
}

async function saveFile(file, trx = null) {
  const fileData = {
    f_name: file.filename,
    f_original_name: file.originalname,
    f_type: file.mimetype,
    f_size: file.size,
  };
  if (trx) {
    const [result] = await attachmentRepository()
      .transacting(trx)
      .insert(fileData)
      .returning("fid");
    return { fid: result.fid, ...fileData };
  }
  const [result] = await attachmentRepository()
    .insert(fileData)
    .returning("fid");
  return { fid: result.fid, ...fileData };
}

function getAttachments(fids) {
  return attachmentRepository()
    .whereIn("fid", fids)
    .select("fid", "f_name", "f_original_name", "f_type", "f_size");
}

async function deleteFiles(filePaths = []) {
  if (!filePaths || !filePaths.length) return;

  await Promise.allSettled(
    filePaths.map((fp) => {
      const target = typeof fp === "string" ? fp : fp.path;
      const normalizedPath = path.isAbsolute(target)
        ? target
        : path.resolve(".", target);

      return unlink(normalizedPath).catch((err) => {
        // If file not found, ignore and continue
        if (err.code !== "ENOENT") {
          console.error("Error deleting file:", err);
        }
      });
    }),
  );
}

module.exports = { saveFile, getAttachments, deleteFiles };
