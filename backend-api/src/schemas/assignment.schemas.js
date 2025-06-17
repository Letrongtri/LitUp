const { z } = require("zod");

const assignmentSchema = z.object({
  aid: z.coerce.number().int().nonnegative(),
  cid: z.coerce.number().int().nonnegative(),
  a_title: z.string().max(255),
  a_description: z.string().max(10000),
  a_max_points: z.coerce.number(),
  a_status: z.coerce.boolean().optional(),
  a_created_at: z.string().optional(),
  a_updated_at: z.string().optional(),
  a_deadline_at: z.string().optional(),
  a_allow_late_submission: z.coerce.boolean().optional(),
  attachments: z.any().optional(),
});

// Mostly used for JSDoc annotations
const partialAssignmentSchema = assignmentSchema.partial();

module.exports = {
  assignmentSchema,
  partialAssignmentSchema,
};
