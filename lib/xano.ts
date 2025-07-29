import axios from "axios";

export const xano = axios.create({
  baseURL: process.env.NEXT_PUBLIC_XANO_API_URL || "https://api.jobjaeger.de/api:cPR_tiTl",
  headers: { "Content-Type": "application/json" },
});

export const loginWithXano = async (email: string, password: string) => {
  const res = await xano.post("/auth/login", { email, password });
  return res.data; // { authToken, user }
};

export const signUpWithXano = async (name: string, email: string, password: string) => {
  const res = await xano.post("/auth/signup", { name, email, password });
  return res.data; // { authToken, user }
};

export const getCurrentUser = async (token: string) => {
  const res = await xano.get("/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const requestPasswordReset = async (email: string) => {
  const res = await xano.post("/auth/password-request", { email });
  return res.data;
};

export const resetPassword = async (code: string, password: string, password_confirm: string) => {
  const res = await xano.post("/auth/password-reset", { code, password, password_confirm });
  return res.data;
};

export const resendVerificationCode = async (email: string) => {
  const res = await xano.post("/auth/resend-code", { email });
  return res.data;
};

export const verifyEmail = async (email: string, code: number) => {
  const res = await xano.post("/auth/verify", { email, code });
  return res.data;
};

export const getOnboardingStatus = async (token: string) => {
  const res = await xano.get("/auth/onboarding", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}; 