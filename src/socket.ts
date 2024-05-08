import { io } from "socket.io-client";
import useAuth from "./OnlineShop/hooks/useAuth";

// "undefined" means the URL will be computed from the `window.location` object
const URL = "http://localhost:9000";
export const useSocket = () => {
  const token = useAuth((state) => state.token);
  return io(URL, {
    extraHeaders: {
      Authorization: `Bearer  ${token}`,
    },
    autoConnect: false,
  });
};
