import { message } from "antd";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import axiosClient from "../config/axiosClient";

interface loggedInUserRoles {
  id: number;
  name: string;
}
interface loggedInUser {
  id: number;
  email: string;
  roleCode: loggedInUserRoles[];
}
interface loginForm {
  email: string;
  password: string;
}
interface authInterface {
  loggedInUser: loggedInUser | null;
  token: string | null;
  refreshToken: string | null;
  login: (data: loginForm) => void;
  logout: () => void;
  refresh: () => void;
}

const useAuth = create<authInterface>()(
  devtools(
    persist(
      (set, get) => ({
        loggedInUser: null,
        token: null,
        refreshToken: null,
        login: async (data: loginForm) => {
          try {
            message.loading({ key: "login", content: "Đang đăng nhập" });
            const response: any = await axiosClient.post(
              "admin/auth/login",
              data
            );
            if (response.data) {
              set((state) => ({ token: response.data.payload.data.token }));
              set((state) => ({
                loggedInUser: response.data.payload.data.employee,
              }));
              set((state) => ({
                refreshToken: response.data.payload.data.refreshToken,
              }));
              message.success({
                key: "login",
                content: "Đăng nhập thành công",
              });
            } else
              message.error({
                key: "login",
                content:
                  response.data.message ||
                  "Tên đăng nhập hoặc mật khẩu không đúng",
              });
          } catch (error: any) {
            message.error({
              key: "login",
              content: error.response.data.message || "Có lỗi khi đăng nhập",
            });
          }
        },
        logout: () => {
          set(() => ({
            loggedInUser: null,
            token: null,
            refreshToken: null,
          }));
          message.success({ content: "Đã đăng xuất" });
        },
        refresh: async () => {
          try {
            const response = await axiosClient.post(
              "admin/auth/refresh-token",
              {
                refreshToken: get().refreshToken,
              }
            );
            //chú ý bên login là loggedInUser :|
            if (response.data) {
              set((state) => ({ token: response.data.payload.data.token }));
              set((state) => ({
                loggedInUser: response.data.payload.data.employee.roleCode,
              }));
              set((state) => ({
                refreshToken: response.data.payload.data.refreshToken,
              }));
              console.log("Refreshed tokens");
            }
          } catch (error: any) {
            console.log(
              "Failed to refresh accessToken (Your account might be logged in somewhere): " +
                error.response.data.message
            );
          }
        },
      }),
      { name: "auth" } //remove getStorage() by deprecated and default to localStorage
    )
  )
);
export default useAuth;
