// src / api / workerAxios.js;
import axios from "axios";

const workerApi = axios.create({
  baseURL: "http://127.0.0.1:8000/api/worker/",
});

workerApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

workerApi.interceptors.response.use(
  (r) => r,
  async (err) => {
    if (err.response?.status === 401) {
      const refresh = localStorage.getItem("worker-refresh");
      const res = await axios.post("/api/worker/token/refresh/", {
        refresh,
      });

      localStorage.setItem("worker-access", res.data.access);
      err.config.headers.Authorization = `Bearer ${res.data.access}`;
      return workerApi(err.config);
    }
    return Promise.reject(err);
  }
);

export default workerApi;
