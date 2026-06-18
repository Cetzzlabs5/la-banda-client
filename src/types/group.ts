import { z } from "zod";

export const GROUP_TYPES = ["OPEN", "CLOSED"] as const;
export type GroupType = typeof GROUP_TYPES[number];

export const createGroupSchema = z.object({
  name: z
    .string()
    .min(3, "Mínimo 3 caracteres")
    .max(40, "Máximo 40 caracteres")
    .regex(/^[a-zA-Z0-9\s-]+$/, "Solo letras, números, espacios y guiones"),
  description: z
    .string()
    .max(120, "Máximo 120 caracteres")
    .optional()
    .or(z.literal("")),
  type: z.enum(GROUP_TYPES, { message: "Seleccioná un tipo" }),
});

export type CreateGroupFormData = z.infer<typeof createGroupSchema>;

export interface Group {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  type: GroupType;
  avatarUrl?: string;
  inviteCode: string;
  leader: string;
  memberships: string[];
  createdAt: string;
  updatedAt: string;
}
