const { z } = require("zod");

const submissionAttachmentSchema = z.object({
  sid: z.coerce.number().int().nonnegative(),
  fid: z.coerce.number().int().nonnegative(),
});

// Mostly used for JSDoc annotations
const partialSubmissionAttachmentSchema = submissionAttachmentSchema.partial();

module.exports = {
  submissionAttachmentSchema,
  partialSubmissionAttachmentSchema,
};
