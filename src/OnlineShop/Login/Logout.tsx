import useAuth from "../hooks/useAuth";
import { Button, Flex } from "antd";
import styles from "./Logout.module.css";

export default function Logout() {
  const email = useAuth((state) => state.loggedInUser?.email);
  const role: any = useAuth((state) => state.loggedInUser?.roleCode);
  const logout = useAuth((state) => state.logout);
  return (
    <Flex gap={20} style={{ height: "100%" }} align="center">
      <Flex vertical className={styles.userinfo}>
        <strong style={{ fontWeight: 600 }}>{email}</strong> <span>{role}</span>
      </Flex>
      <Button onClick={() => logout()}>Đăng xuất</Button>
    </Flex>
  );
}
