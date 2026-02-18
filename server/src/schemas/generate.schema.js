const { z } = require('zod');

const stopSchema = z.object({
  countryOrRegion: z.string().optional().default(''),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD').optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD').optional(),
  climateOverride: z.enum(['cold', 'moderate', 'hot', 'mixed', 'rainy']).nullable().optional(),
  rainExpected: z.boolean().nullable().optional(),
});

const generateInputSchema = z.object({
  citizenship: z.string().optional().default(''),
  stops: z.array(stopSchema).min(1, 'At least one stop is required'),
  bagLiters: z.number().positive(),
  climateOverall: z.enum(['cold', 'moderate', 'hot', 'mixed']).optional(),
  laundry: z.enum(['none', 'weekly', 'frequent']),
  workSetup: z.enum(['none', 'light', 'heavy']),
  gender: z.enum(['male', 'female', 'non-binary', 'prefer-not-to-say']),
  mustBringItems: z.array(z.string().min(1)).optional(),
  isIndefiniteTravel: z.boolean().optional().default(false),
  forcePassportRecommended: z.boolean().optional().default(false),
});

function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ errors: result.error.issues });
    }
    req.validated = result.data;
    next();
  };
}

module.exports = { generateInputSchema, validate };
