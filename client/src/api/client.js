const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

function getToken() {
  return localStorage.getItem("plrs_token");
}

async function request(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    throw new Error(payload?.message || "Request failed.");
  }

  return payload;
}

export const api = {
  login: (payload) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  signup: (payload) =>
    request("/auth/signup", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  me: () => request("/auth/me"),
  getProfile: () => request("/profile"),
  updateProfile: (payload) =>
    request("/profile", {
      method: "PUT",
      body: JSON.stringify(payload)
    }),
  listGoals: () => request("/goals"),
  createGoal: (payload) =>
    request("/goals", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  getDashboard: (goalId) => request(`/dashboard${goalId ? `?goalId=${goalId}` : ""}`),
  getLearningPath: (goalId) => request(`/learning-path${goalId ? `?goalId=${goalId}` : ""}`),
  generateLearningPath: (payload) =>
    request("/learning-path/generate", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  getProgress: (goalId) => request(`/progress${goalId ? `?goalId=${goalId}` : ""}`),
  updateProgress: (topicId, payload) =>
    request(`/progress/${topicId}`, {
      method: "PATCH",
      body: JSON.stringify(payload)
    }),
  getLatestRecommendation: (goalId) =>
    request(`/recommendations/latest${goalId ? `?goalId=${goalId}` : ""}`),
  generateRecommendations: (payload) =>
    request("/recommendations/generate", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  getInsights: (goalId) => request(`/recommendations/insights${goalId ? `?goalId=${goalId}` : ""}`)
};

