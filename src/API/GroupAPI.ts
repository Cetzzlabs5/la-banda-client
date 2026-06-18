import api from "@/libs/axios";
import { throwStandardError } from "@/utils/apiError";
import type { Group } from "@/types/group";

// Return type omitted intentionally: throwStandardError returns never, but TS 5.9
// flags the catch-only-throw path as lacking a return statement when an explicit
// Promise<T> type is declared. UserAPI.ts follows the same pattern.
export async function createGroup(formData: FormData) {
  try {
    const { data } = await api.post<Group>("/groups", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  } catch (error) {
    throwStandardError(error);
  }
}
