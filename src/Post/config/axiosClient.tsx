import axios from "axios";
const axiosClient = axios.create({
  // baseURL: "http://localhost:9000/article/",
  baseURL:
    process.env.DEVELOPMENT_STAGE === "production"
      ? process.env.PUBLIC_baseURL
      : "http://localhost:9000" + "article/",
  timeout: 30000,
});
export default axiosClient;
