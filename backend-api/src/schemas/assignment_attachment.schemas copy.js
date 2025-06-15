const { z } = require("zod");

const assignmentAttachmentSchema = z.object({
  aid: z.coerce.number().int().nonnegative(),
  fid: z.coerce.number().int().nonnegative(),
});

// Mostly used for JSDoc annotations
const partialAssignmentAttachmentSchema = assignmentAttachmentSchema.partial();

module.exports = {
  assignmentAttachmentSchema,
  partialAssignmentAttachmentSchema,
};
