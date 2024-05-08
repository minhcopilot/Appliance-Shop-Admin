import React from "react";
import "./App.css";
import { Button, ConfigProvider, Layout, Menu, MenuProps, Result } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import locale from "antd/locale/vi_VN";
import { Outlet, Link, useLocation } from "react-router-dom";
import Loginant from "./OnlineShop/Login/Loginant";
import useAuth from "./OnlineShop/hooks/useAuth";
import Logout from "./OnlineShop/Login/Logout";
import { GiDoctorFace } from "react-icons/gi";
import { useSocketHandler } from "./Chat/chatHandler";
import { useSocket } from "./socket";

const HeaderContent = () => {
  const loggedInUser = useAuth((state) => state.loggedInUser);
  return !loggedInUser ? <Loginant /> : <Logout />;
};

export const Welcome = () => {
  return (
    <Result
      icon={<GiDoctorFace style={{ fontSize: 50 }} />}
      title="Chào mừng các bạn đến với đồ án nhóm 2 "
      extra={
        <Button type="primary">
          <Link to="/management">Đi đến trang quản lý</Link>
        </Button>
      }
    />
  );
};

export default function App() {
  // const {
  //   token: { colorBgContainer },
  // } = theme.useToken();
  const location = useLocation();
  const loggedInUser = useAuth((state) => state.loggedInUser);
  const socket = useSocket();
  const socketHandler = useSocketHandler();
  React.useEffect(() => {
    socketHandler();
  }, []);
  React.useEffect(() => {
    !loggedInUser && socket.disconnect();
  }, [loggedInUser]);
  return (
    <ConfigProvider locale={locale}>
      <Layout
        style={{
          backgroundImage:
            "url('https://png.pngtree.com/thumb_back/fw800/back_our/20190625/ourmid/pngtree-window-kitchen-small-fresh-home-appliance-poster-image_254040.jpg')",
        }}
      >
        <Header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
            zIndex: 1,
          }}
        >
          <Menu
            theme="dark"
            style={{ width: "90%" }}
            selectedKeys={[location.pathname.split("/")[1]]}
            mode="horizontal"
            items={[
              {
                key: "",
                label: <Link to="">Home</Link>,
              },
              {
                key: "management",
                label: <Link to="management">Online Shop</Link>,
              },
              {
                key: "article",
                label: <Link to="article">Article</Link>,
              },
              {
                key: "chat",
                label: <Link to="chat">Chat</Link>,
              },
            ]}
          />
          <HeaderContent />
        </Header>
        <Content>
          <Outlet />
        </Content>
      </Layout>
    </ConfigProvider>
  );
}
