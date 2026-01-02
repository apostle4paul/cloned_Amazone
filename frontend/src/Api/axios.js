import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:5002/clone-5ec11/us-central1/api", // Firebase emulator URL
});
