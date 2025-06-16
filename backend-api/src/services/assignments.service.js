const knex = require("../database/knex");
const { saveFile } = require("./attachments.service");

function assignmentRepository() {
  return knex("assignments");
}

// function attachmentRepository() {
//   return knex("attachments");
// }

function assignmentAttachmentRepository() {
  return knex("assignment_attachments");
}

function readAssignmentData(payload) {
  return {
    ...(payload.cid ? { cid: payload.cid } : {}),
    ...(payload.a_title ? { a_title: payload.a_title } : {}),
    ...(payload.a_description ? { a_description: payload.a_description } : {}),
    ...(payload.a_max_points ? { a_max_points: payload.a_max_points } : {}),
    ...(payload.a_deadline_at ? { a_deadline_at: payload.a_deadline_at } : {}),
    ...(payload.a_allow_late_submission !== undefined && {
      a_allow_late_submission: payload.a_allow_late_submission,
    }),
  };
}

// Define functions for accessing the database

async function createAssignment(newAssignment, files) {
  const assignmentData = readAssignmentData(newAssignment);

  const [result] = await assignmentRepository()
    .insert(assignmentData)
    .returning("aid");
  const aid = result.aid;

  const attachments = [];
  for (const file of files) {
    const attachment = await saveFile(file);
    attachments.push(attachment);
    await assignmentAttachmentRepository().insert({
      fid: attachment.fid,
      aid,
    });
  }

  return { aid, ...assignmentData, attachments };
}

module.exports = {
  createAssignment,
};
