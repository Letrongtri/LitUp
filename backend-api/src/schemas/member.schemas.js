const { z } = require("zod");

const memberSchema = z.object({
  mid: z.coerce.number().int().nonnegative(),
  uid: z.coerce.number().int().nonnegative(),
  cid: z.coerce.number().int().nonnegative(),
  m_status: z.boolean().optional().default(true),
  m_joined_at: z.date().optional(),
  m_removed_at: z.date().optional(),
});

// Mostly used for JSDoc annotations
const partialMemberSchema = memberSchema.partial();

module.exports = {
  memberSchema,
  partialMemberSchema,
};
