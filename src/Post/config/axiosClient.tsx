import axios from "axios";
const axiosClient = axios.create({
  baseURL: "http://localhost:9000/article/",
  timeout: 30000,
});
export default axiosClient;
