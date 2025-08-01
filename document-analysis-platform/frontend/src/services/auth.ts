import api from "./api";

export const register = (data: {email:string, password:string, full_name?:string}) => api.post("/auth/register", data);
export const login = (data: {email:string, password:string}) => api.post("/auth/login", data);
export const logout = () => localStorage.removeItem("jwt_token");
