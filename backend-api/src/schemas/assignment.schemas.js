const { z } = require("zod");

const assignmentSchema = z.object({
  aid: z.coerce.number().int().nonnegative(),
  cid: z.coerce.number().int().nonnegative(),
  a_title: z.string().max(255),
  a_description: z.string().max(10000),
  a_max_points: z.coerce.number(),
  a_created_at: z.date().optional(),
  a_updated_at: z.date().optional(),
  a_dealine_at: z.date().optional(),
  a_allow_late_submission: z.boolean().optional().default(true),
});

// Mostly used for JSDoc annotations
const partialAssignmentSchema = assignmentSchema.partial();

module.exports = {
  assignmentSchema,
  partialAssignmentSchema,
};
