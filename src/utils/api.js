import { backendURL } from "../config";

export function resolveAssetUrl(url) {
  if (!url) return "/Assets/solarpanel.jpg";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
    return url;
  }
  if (url.startsWith("/uploads/")) {
    return `${backendURL}${url}`;
  }
  if (url.startsWith("../Assets/")) {
    return url.replace("../Assets/", "/Assets/");
  }
  return url.startsWith("/") ? url : `/${url}`;
}

export function getToken(role = "customer") {
  return role === "vendor"
    ? localStorage.getItem("vendorToken")
    : localStorage.getItem("customerToken");
}

export async function apiRequest(path, { method = "GET", body, role, headers = {} } = {}) {
  const token = role ? getToken(role) : null;
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  const finalHeaders = { ...headers };
  if (token) {
    finalHeaders.Authorization = `Bearer ${token}`;
  }
  if (!isFormData && body !== undefined && !finalHeaders["Content-Type"]) {
    finalHeaders["Content-Type"] = "application/json";
  }

  const response = await fetch(`${backendURL}${path}`, {
    method,
    headers: finalHeaders,
    body: isFormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { message: text };
  }

  if (!response.ok) {
    const err = new Error(data.error || data.message || "Request failed");
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data;
}
