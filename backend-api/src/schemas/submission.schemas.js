const { z } = require("zod");

const submissionSchema = z.object({
  sid: z.coerce.number().int().nonnegative(),
  aid: z.coerce.number().int().nonnegative(),
  uid: z.coerce.number().int().nonnegative(),
  s_status: z.coerce.boolean().optional(),
  s_submitted_at: z.string().optional(),
  s_updated_at: z.string().optional(),
  s_grade: z.coerce.number().nonnegative().optional(),
  s_comment: z.string().max(10000).optional(),
  s_graded_at: z.string().optional(),
  attachments: z.any().optional(),
});

// Mostly used for JSDoc annotations
const partialSubmissionSchema = submissionSchema.partial();

module.exports = {
  submissionSchema,
  partialSubmissionSchema,
};
