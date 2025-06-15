const { z } = require("zod");

const attachmentSchema = z.object({
  fid: z.coerce.number().int().nonnegative(),
  f_name: z.string().max(255),
  f_orginal_name: z.string().max(50).optional(),
  f_type: z.string().max(255).optional(),
  f_size: z.coerce.number.int().nonnegative().optional(),
  f_created_at: z.date().optional(),
  // validate file upload object type
  uploadFile: z
    .instanceof(Object)
    .refine((file) => file && file.fieldname === "uploadFile", {
      message: "Invalid uploaded file",
    })
    .optional(),
});

// Mostly used for JSDoc annotations
const partialAttachmentSchema = attachmentSchema.partial();

module.exports = {
  attachmentSchema,
  partialAttachmentSchema,
};
