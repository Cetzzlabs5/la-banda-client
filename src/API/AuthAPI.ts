import type { Auth } from "@/types/auth";
import api from "@/libs/axios";
import { throwStandardError } from "@/utils/apiError";

export async function Register(formData: Auth) {
    try {
        const url = '/auth/register'
        const { data } = await api.post<string>(url, formData)

        return data
    } catch (error) {
        throwStandardError(error)
    }

}