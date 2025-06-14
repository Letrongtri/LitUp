const { z } = require("zod");

const classroomSchema = z.object({
  cid: z.coerce.number().int().nonnegative(),
  c_name: z.string().max(255),
  c_code: z.string().length(6),
  c_status: z.boolean().optional().default(true),
  c_created_at: z.date().optional(),
  c_updated_at: z.date().optional(),
});

// Mostly used for JSDoc annotations
const partialClassroomSchema = classroomSchema.partial();

module.exports = {
  classroomSchema,
  partialClassroomSchema,
};
