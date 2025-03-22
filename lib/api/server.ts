"use server";

import { cookies } from "next/headers";
import { apiFetch } from "./fetch";

export const get = async <T>(url: string, options: RequestInit = {}) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  return apiFetch<T>(url, { ...options, method: "GET" }, accessToken);
};

export const post = async <T>(
  url: string,
  data: any,
  options: RequestInit = {}
) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  return apiFetch<T>(
    url,
    {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    },
    accessToken
  );
};

export const put = async <T>(
  url: string,
  data: any,
  options: RequestInit = {}
) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  return apiFetch<T>(
    url,
    {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    },
    accessToken
  );
};

export const del = async <T>(url: string, options: RequestInit = {}) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  return apiFetch<T>(url, { ...options, method: "DELETE" }, accessToken);
};
