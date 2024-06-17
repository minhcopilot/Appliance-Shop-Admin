import axios from "axios";
const axiosClient = axios.create({
  baseURL: `${process.env.REACT_APP_BASE_URL}/article/`,
  timeout: 30000,
});
export default axiosClient;
