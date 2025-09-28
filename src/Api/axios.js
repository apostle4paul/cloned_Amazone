import axios from "axios";

// For local Firebase emulator:
export const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:5001/clone-c278a/us-central1/api",
  // replace 'clone-c278a' with your Firebase project ID
});
