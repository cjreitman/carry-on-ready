const { z } = require('zod');

const stopSchema = z.object({
  countryOrRegion: z.string().min(1),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD'),
  climateOverride: z.enum(['cold', 'moderate', 'hot', 'mixed', 'rainy']).nullable().optional(),
  rainExpected: z.boolean().optional(),
});

const generateInputSchema = z.object({
  stops: z.array(stopSchema).min(1, 'At least one stop is required'),
  bagLiters: z.number().positive(),
  climateOverall: z.enum(['cold', 'moderate', 'hot', 'mixed', 'rainy']),
  laundry: z.enum(['none', 'weekly', 'frequent']),
  workSetup: z.enum(['none', 'light', 'heavy']),
  passportRegion: z.enum(['US', 'EU', 'UK', 'other']),
  schengenDaysUsedLast180: z.number().int().min(0).max(90),
  mustBringItems: z.array(z.string().min(1)).optional(),
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
