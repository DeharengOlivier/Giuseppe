import { z } from 'zod'

// Article validation schemas
export const createArticleSchema = z.object({
  title: z.string().min(1, 'Le titre est requis').max(200, 'Le titre est trop long'),
  content: z.string().min(1, 'Le contenu est requis'),
  excerpt: z.string().min(1, 'L\'extrait est requis').max(500, 'L\'extrait est trop long'),
  published: z.boolean().default(false),
})

export const updateArticleSchema = z.object({
  title: z.string().min(1, 'Le titre est requis').max(200, 'Le titre est trop long'),
  content: z.string().min(1, 'Le contenu est requis'),
  excerpt: z.string().min(1, 'L\'extrait est requis').max(500, 'L\'extrait est trop long'),
  published: z.boolean(),
})

// Prestation validation schemas
export const createPrestationSchema = z.object({
  title: z.string().min(1, 'Le titre est requis').max(200, 'Le titre est trop long'),
  description: z.string().min(1, 'La description est requise'),
  price: z.string().nullable().optional(),
  benefits: z.array(z.string()).default([]),
  order: z.number().int().default(0),
  published: z.boolean().default(true),
})

export const updatePrestationSchema = z.object({
  title: z.string().min(1, 'Le titre est requis').max(200, 'Le titre est trop long'),
  description: z.string().min(1, 'La description est requise'),
  price: z.string().nullable().optional(),
  benefits: z.array(z.string()),
  order: z.number().int(),
  published: z.boolean(),
})

// Experience validation schemas
export const createExperienceSchema = z.object({
  position: z.string().min(1, 'Le poste est requis').max(200, 'Le poste est trop long'),
  company: z.string().min(1, 'L\'entreprise est requise').max(200, 'L\'entreprise est trop longue'),
  location: z.string().nullable().optional(),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Date de début invalide',
  }),
  endDate: z.string().nullable().optional().refine((date) => {
    if (!date) return true
    return !isNaN(Date.parse(date))
  }, {
    message: 'Date de fin invalide',
  }),
  current: z.boolean().default(false),
  description: z.string().min(1, 'La description est requise'),
  skills: z.array(z.string()).default([]),
  order: z.number().int().default(0),
})

export const updateExperienceSchema = z.object({
  position: z.string().min(1, 'Le poste est requis').max(200, 'Le poste est trop long'),
  company: z.string().min(1, 'L\'entreprise est requise').max(200, 'L\'entreprise est trop longue'),
  location: z.string().nullable().optional(),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Date de début invalide',
  }),
  endDate: z.string().nullable().optional().refine((date) => {
    if (!date) return true
    return !isNaN(Date.parse(date))
  }, {
    message: 'Date de fin invalide',
  }),
  current: z.boolean(),
  description: z.string().min(1, 'La description est requise'),
  skills: z.array(z.string()),
  order: z.number().int(),
})

// Page Content validation schema
export const updatePageContentSchema = z.object({
  key: z.string().min(1, 'La clé est requise'),
  value: z.string().min(1, 'La valeur est requise'),
  type: z.enum(['text', 'textarea', 'image']).default('text'),
})

// Helper function to validate and return errors
type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: { path: string; message: string }[] }

export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): ValidationResult<T> {
  const result = schema.safeParse(data)

  if (!result.success) {
    const errors = result.error.errors.map(err => ({
      path: err.path.join('.'),
      message: err.message,
    }))
    return { success: false, errors }
  }

  return { success: true, data: result.data }
}
