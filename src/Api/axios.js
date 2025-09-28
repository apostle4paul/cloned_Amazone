// src/Api/axios.js
import axios from "axios";

// Create an Axios instance pointing to your backend
const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:5001/clone-c278a/us-central1/api", // change if your backend is on another port
});
 export {axiosInstance};