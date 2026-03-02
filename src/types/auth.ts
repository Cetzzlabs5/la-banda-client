export interface Auth {
    name: string
    lastName: string
    password?: string;
    confirmPassword?: string
    email: string;
    birthdate?: Date
}

export type RequestToken = Pick<Auth, 'email'>

export type ConfirmToken = {
    token: string
}

export type LoginFormDataType = Pick<Auth, 'email' | 'password'>

export interface User extends Auth {
    _id: string
    isActive: boolean
    role: string
}