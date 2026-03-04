import { z } from "zod";
import type { Auth } from "./auth";

export const updateProfileSchema = z.object({
    name: z.string().min(2, "Mínimo 2 caracteres"),
    lastName: z.string().min(2, "Mínimo 2 caracteres"),
    birthdate: z.string().optional()
});

export type UpdateProfileDataType = z.infer<typeof updateProfileSchema>;

export interface UserProfile extends Auth {
    _id: string;
    isActive: boolean;
    role: string;
    createdAt: string;
    updatedAt: string;
}
