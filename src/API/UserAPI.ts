import api from "@/libs/axios";
import { throwStandardError } from "@/utils/apiError";
import type { UpdateProfileDataType, UserProfile } from "@/types/user";

export async function getUserProfile() {
    try {
        const url = '/users/profile';
        const { data } = await api.get<UserProfile>(url);

        return data;
    } catch (error) {
        throwStandardError(error);
    }
}

export async function updateUserProfile(formData: UpdateProfileDataType) {
    try {
        const url = '/users/profile';
        const { data } = await api.put<string>(url, formData);
        return data;
    } catch (error) {
        throwStandardError(error);
    }
}
