import api from "@/libs/axios";
import { throwStandardError } from "@/utils/apiError";
import type { CreateBarFormData, MyBar, RegisterBarResponse } from "@/types/bar";

export async function registerBar(body: CreateBarFormData) {
  try {
    const { data } = await api.post<RegisterBarResponse>("/bar/registro", body);
    return data;
  } catch (error) {
    throwStandardError(error);
  }
}

export async function getMyBars() {
  try {
    const { data } = await api.get<MyBar[]>("/bar/mis-bares");
    return data;
  } catch (error) {
    throwStandardError(error);
  }
}
