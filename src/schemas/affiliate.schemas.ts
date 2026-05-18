import { z } from 'zod'

export const affiliateSchema = z.object({
    first_name: z.string().min(1, 'El nombre es requerido'),
    last_name: z.string().min(1, 'El apellido es requerido'),
    email: z.string().email('El email no es válido'),
    membershipTypeId: z.coerce.number().int().positive('Debe seleccionar un tipo de membresía'),
})

export const affiliateAdminSchema = affiliateSchema.extend({
    userId: z.coerce.number().int().positive('Debe seleccionar un usuario'),
})

export type AffiliateInput = z.infer<typeof affiliateSchema>
export type AffiliateAdminInput = z.infer<typeof affiliateAdminSchema>