import axios, { AxiosError } from "axios";

// ------------------ Types ------------------ //

export interface AuthResponse {
  token?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  error?: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

// ------------------ Constants ------------------ //

const API_URL = "http://localhost:8000"; // backend base URL

// ------------------ Token Helpers ------------------ //

export function saveToken(token: string) {
  localStorage.setItem("token", token);
}

export function getToken(): string | null {
  return localStorage.getItem("token");
}

export function logout() {
  localStorage.removeItem("token");
}

// ------------------ Axios Instance ------------------ //

const api = axios.create({
  baseURL: API_URL,
});

// Attach JWT token automatically to every request
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ------------------ Auth Functions ------------------ //

export async function signup(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  try {
    if (!email.endsWith("@vitstudent.ac.in")) {
      return { error: "Only VIT student emails are allowed." };
    }

    const payload: SignupPayload = { name, email, password };
    const response = await api.post<AuthResponse>("/auth/signup", payload);
    return response.data;
  } catch (err) {
    return handleAxiosError(err);
  }
}

export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  try {
    const payload: LoginPayload = { email, password };
    const response = await api.post<AuthResponse>("/auth/login", payload);
    return response.data;
  } catch (err) {
    return handleAxiosError(err);
  }
}

// ------------------ Protected API Example ------------------ //

export async function getUserProfile(): Promise<AuthResponse> {
  try {
    const response = await api.get<AuthResponse>("/auth/me");
    return response.data;
  } catch (err) {
    return handleAxiosError(err);
  }
}

// ------------------ Error Handler ------------------ //

function handleAxiosError(err: unknown): AuthResponse {
  if (axios.isAxiosError(err)) {
    const axiosErr = err as AxiosError<AuthResponse>;
    return (
      axiosErr.response?.data || {
        error: "Server error. Please try again.",
      }
    );
  }

  return { error: "Unexpected error occurred." };
}
