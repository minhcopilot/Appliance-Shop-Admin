import axios from "axios";
const axiosClient = axios.create({
  baseURL: `${process.env.REACT_APP_BASE_URL}`,
  timeout: 30000,
});

axiosClient.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage
    const authData = JSON.parse(localStorage.getItem("auth") ?? "{}");
    const token = authData?.state.token;
    // Nếu có token, thêm vào header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default axiosClient;
