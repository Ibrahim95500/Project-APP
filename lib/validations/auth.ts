import { z } from "zod"

export const registerSchema = z.object({
    email: z.string().email("Email invalide"),
    password: z.string().min(6, "Le mot de passe doit faire au moins 6 caractères"),
    businessName: z.string().min(2, "Le nom de l'établissement est requis"),
})

export type RegisterInput = z.infer<typeof registerSchema>

export const loginSchema = z.object({
    email: z.string().email("Email invalide"),
    password: z.string().min(1, "Le mot de passe est requis"),
})
