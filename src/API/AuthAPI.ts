import type { Auth, ConfirmToken, RequestToken } from "@/types/auth";
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

export async function confirmAccount(formData: ConfirmToken) {
    try {
        const url = '/auth/confirm-account'
        const { data } = await api.post<string>(url, formData)
        return data

    } catch (error) {
        throwStandardError(error)
    }
}

export async function requestConfirmationCode(formData: RequestToken) {
    try {
        const url = '/auth/request-code'
        const { data } = await api.post<string>(url, formData)
        return data

    } catch (error) {
        throwStandardError(error)
    }
}