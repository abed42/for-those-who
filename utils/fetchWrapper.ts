import { BACKEND_URL } from "@/constants/ApiUrl";

interface FetchOptions extends RequestInit {
  headers?: HeadersInit;
}

const fetchWrapper = async <T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> => {
  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
  };

  const config: FetchOptions = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${BACKEND_URL}${endpoint}`, config);
    if (!response.ok) {
      // Handle HTTP errors
      throw new Error(`${response.status}`);
    }
    // Parse and return JSON if the response is OK
    const data = await response.json();
    return data;
  } catch (error) {
    // Handle fetch errors
    console.error("Fetch error:", error);
    throw error;
  }
};

export default fetchWrapper;
