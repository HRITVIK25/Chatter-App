import axios from "axios";

export const axiosInstance = axios.create({
<<<<<<< HEAD
  baseURL: import.meta.env.MODE === "development" ?  "http://localhost:5001/api" : "/api",
=======
  baseURL: "http://localhost:5001/api",
>>>>>>> d01ffeaf15323214f19a85442de89a743a222bff
  withCredentials: true,
});
