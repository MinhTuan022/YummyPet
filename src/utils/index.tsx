export const formatDate = (input: string | Date): string => {
  const d = typeof input === "string" ? new Date(input) : input;
  if (isNaN(d.getTime())) return "Invalid date";

  const pad = (n: number) => n.toString().padStart(2, '0');

  const day = pad(d.getDate());
  const month = pad(d.getMonth() + 1); // Tháng tính từ 0
  const year = d.getFullYear();
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  const seconds = pad(d.getSeconds());

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};

import {jwtDecode} from "jwt-decode";

export const getUserRoleFromToken = (): string | null => {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  try {
    const decoded: any = jwtDecode(token);
    return decoded.role || null;
  } catch (error) {
    console.error("Token decode failed", error);
    return null;
  }
};
