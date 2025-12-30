import axios from "axios";

// For local Firebase emulator:
export const axiosInstance = axios.create({
  // local instance of firebase fuction
  // baseURL: "http://127.0.0.1:5001/clone-c278a/us-central1/api",
  // deployed version of amazon server on render.com
  baseURL: "https://amazon-api3-deploy.onrender.com/"
  // replace 'clone-c278a' with your Firebase project ID
});
