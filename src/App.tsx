import React from "react";
import "./App.css";
import { Button, ConfigProvider, Layout, Menu, MenuProps, Result } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import locale from "antd/locale/vi_VN";
import { Outlet, Link } from "react-router-dom";
import Loginant from "./OnlineShop/Login/Loginant";
import useAuth from "./OnlineShop/hooks/useAuth";
import Logout from "./OnlineShop/Login/Logout";
import { GiDoctorFace } from "react-icons/gi";

const HeaderContent = () => {
  const loggedInUser = useAuth((state) => state.loggedInUser);
  return !loggedInUser ? <Loginant /> : <Logout />;
};

export const Welcome = () => {
  return (
    <Result
      icon={<GiDoctorFace style={{ fontSize: 50 }} />}
      title="Hi! Welcome to Le Minh Vuong's ReactJS Homework!"
      extra={
        <Button type="primary">
          <Link to="/management">Go to Online Shop</Link>
        </Button>
      }
    />
  );
};

export default function App() {
  // const {
  //   token: { colorBgContainer },
  // } = theme.useToken();
  const [current, setCurrent] = React.useState("home");
  const onClick: MenuProps["onClick"] = (e) => {
    setCurrent(e.key);
  };
  return (
    <ConfigProvider locale={locale}>
      <Layout>
        <Header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <Menu
            theme="dark"
            style={{ width: "90%" }}
            onClick={onClick}
            selectedKeys={[current]}
            mode="horizontal"
            items={[
              {
                key: "home",
                label: <Link to="/">Home</Link>,
              },
              {
                key: "management",
                label: <Link to="/management">Online Shop</Link>,
              },
              {
                key: "article",
                label: <Link to="/article">Article</Link>,
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
