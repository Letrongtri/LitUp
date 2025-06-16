const { z } = require("zod");

const userSchema = z.object({
  uid: z.coerce.number().int().nonnegative(),
  u_email: z.string().email(),
  u_first_name: z.string().max(100),
  u_last_name: z.string().max(100),
  u_password: z.string().max(255),
  u_role: z.string().max(10),
  u_avatar_id: z.coerce.number().int().nonnegative().optional(),
  u_status: z.coerce.boolean().optional(),
  u_created_at: z.date().optional(),
  u_updated_at: z.date().optional(),
  u_avatar_file: z.any().optional(),
});

// Mostly used for JSDoc annotations
const partialUserSchema = userSchema.partial();

module.exports = {
  userSchema,
  partialUserSchema,
};
