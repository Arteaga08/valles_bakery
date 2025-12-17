import axios from "axios";

const API = axios.create({
  // Asegúrate de que este puerto coincida con tu backend
  baseURL: "http://localhost:5002/api",
});

// Este interceptor es clave para el futuro:
// Enviará automáticamente el token del admin si existe.
API.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null;

  if (userInfo && userInfo.token) {
    config.headers.Authorization = `Bearer ${userInfo.token}`;
  }
  return config;
});

export default API;
