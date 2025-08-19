import axios from "axios";

// Auth/User API (correct project for /auth/login)
export const xano = axios.create({
  baseURL: "https://api.jobjaeger.de/api:cPR_tiTl",
  headers: { "Content-Type": "application/json" },
});

// Google OAuth API
export const xanoGoogleOAuth = axios.create({
  baseURL: "https://api.jobjaeger.de/api:U0aE1wpF",
  headers: { "Content-Type": "application/json" },
});

// Jobtracker API
export const xanoJobtracker = axios.create({
  baseURL: "https://api.jobjaeger.de/api:9BqVCxJj",
  headers: { "Content-Type": "application/json" },
});

// Profile API
export const xanoProfile = axios.create({
  baseURL: "https://api.jobjaeger.de/api:7yCsbR9L",
  headers: { "Content-Type": "application/json" },
});

export const loginWithXano = async (email: string, password: string) => {
  const res = await xano.post("/auth/login", { email, password });
  return res.data; // { authToken }
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

export const getJobTracker = async (token: string) => {
  const res = await xanoJobtracker.get("/job_tracker", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateJobTrackingStatus = async (token: string, trackingId: number, status: string) => {
  const res = await xanoJobtracker.patch(`/job_tracker/${trackingId}`, 
    { status },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const updateJobTrackerStatus = async (token: string, jobId: number, status: string, applicationDate?: number, notes?: string, interviewQuestions?: Array<{question: string, answer: string}>) => {
  const payload = {
    job_id: jobId,
    status: status,
    ...(applicationDate && { application_date: applicationDate }),
    ...(notes && { notes: notes }),
    ...(interviewQuestions && { interview_question: interviewQuestions })
  };

  const res = await xanoJobtracker.post('/job_tracker/update', 
    payload,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

// Profile API functions
export const getProfile = async (token: string, profileId: number) => {
  const res = await xanoProfile.get(`/v2/profile/${profileId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateProfile = async (token: string, profileId: number, profileData: any) => {
  const res = await xanoProfile.put(`/v2/profile/${profileId}`, 
    { data: profileData },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
}; 

// Google OAuth functions
export const initiateGoogleOAuth = async (redirectUri: string) => {
  try {
    console.log('Calling Xano Google OAuth init with redirect_uri:', redirectUri);
    const res = await xanoGoogleOAuth.get(`/oauth/google/init?redirect_uri=${encodeURIComponent(redirectUri)}`);
    console.log('Xano response status:', res.status);
    console.log('Xano response data:', res.data);
    return res.data;
  } catch (error: any) {
    console.error('Error calling Xano Google OAuth init:', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
    }
    throw error;
  }
};

export const continueGoogleOAuth = async (code: string, redirectUri: string) => {
  const res = await xanoGoogleOAuth.post(`/oauth/google/continue`, {
    code,
    redirect_uri: redirectUri
  });
  return res.data;
};

export const loginWithGoogle = async (code: string, redirectUri: string) => {
  const res = await xanoGoogleOAuth.get(`/oauth/google/login?code=${encodeURIComponent(code)}&redirect_uri=${encodeURIComponent(redirectUri)}`);
  return res.data;
};

export const signUpWithGoogle = async (code: string, redirectUri: string) => {
  const res = await xanoGoogleOAuth.get(`/oauth/google/signup?code=${encodeURIComponent(code)}&redirect_uri=${encodeURIComponent(redirectUri)}`);
  return res.data;
}; 