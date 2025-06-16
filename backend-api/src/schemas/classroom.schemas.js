const { z } = require("zod");

const classroomSchema = z.object({
  cid: z.coerce.number().int().nonnegative(),
  uid: z.coerce.number().int().nonnegative(),
  c_name: z.string().max(255),
  c_code: z.string().length(6),
  c_status: z.boolean().optional().default(true),
  c_created_at: z.date().optional(),
  c_updated_at: z.date().optional(),
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().default(5)
});

const getClassroomsByUID = z.object({ 
  input: z.object({ 
    uid: z.coerce.number().positive(), 
    page: z.coerce.number().positive().default(1),
    limit: z.coerce.number().positive().default(5),
  }).strict()
});


// Mostly used for JSDoc annotations
const partialClassroomSchema = classroomSchema.partial();

module.exports = {
  classroomSchema,
  partialClassroomSchema,
  getClassroomsByUID
};
