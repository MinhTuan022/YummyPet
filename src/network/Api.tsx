type Method = "GET" | "POST" | "PUT" | "DELETE";

interface CallApiParams {
  path: string;
  method: Method;
  body?: any;
  onSuccess: (data: any) => void;
  onError?: (error: any) => void;
}

export const _request = async ({
  path,
  method,
  body,
  onSuccess,
  onError,
}: CallApiParams) => {
  try {
    const token = localStorage.getItem("accessToken");
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch("http://localhost:8080/api" + path, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await res.json();

    if (!res.ok) {
      throw data;
    }

    onSuccess(data);
  } catch (error) {
    if (onError) {
      onError(error);
    } else {
      console.error("API Error:", error);
    }
  }
};
