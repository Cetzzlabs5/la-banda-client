import type { Auth, ConfirmToken, LoginFormDataType, RequestToken, User } from "@/types/auth";
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

export async function login(formData: LoginFormDataType) {
    try {
        const url = '/auth/login'
        const { data } = await api.post<string>(url, formData)
        return data
    } catch (error) {
        throwStandardError(error)
    }
}

export async function session() {
    try {
        const url = '/auth/session'
        const { data } = await api.get<User>(url)
        return data
    } catch (error) {
        throwStandardError(error)
    }
}

export async function logout() {
    try {
        const url = '/auth/logout'
        const { data } = await api.get<string>(url)
        return data
    } catch (error) {
        throwStandardError(error)
    }
}
