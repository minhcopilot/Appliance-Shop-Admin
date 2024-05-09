import React from "react";
import styles from "./Chat.module.css";
// import Login, { Button } from "./Login";
// import Category from "./Category";
// import ButtonTabs from "../Session3/Tabs/ButtonTabs";
import { Layout, Menu, Skeleton, Spin, theme } from "antd";

import { Link, Outlet, useLocation } from "react-router-dom";
import Sider from "antd/es/layout/Sider";
import { Content } from "antd/es/layout/layout";
import useAuth from "../OnlineShop/hooks/useAuth";
import { useGetAssignedChat, useGetUnassignedChat } from "./hooks/useGet";
import {
  LoadingOutlined,
  UserAddOutlined,
  UserOutlined,
} from "@ant-design/icons";

export default function Chat() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [sideCollapsed, setSideCollapsed] = React.useState(false);
  const location = useLocation();
  const loggedInUser = useAuth().loggedInUser;
  const assignedChats = useGetAssignedChat();
  const unassignedChats = useGetUnassignedChat();
  const loading = !(assignedChats.isSuccess && unassignedChats.isSuccess);
  return (
    <>
      {loggedInUser ? (
        <Layout style={{ background: colorBgContainer }}>
          <Sider
            style={{
              background: "none",
              overflow: "auto",
              height: "100vh",
              position: "fixed",
              left: 0,
              top: 0,
              bottom: 0,
            }}
            collapsible
            collapsed={sideCollapsed}
            onCollapse={(collapsed) => setSideCollapsed(collapsed)}
            theme="light"
            width={170}
            collapsedWidth={50}
            // defaultCollapsed
            breakpoint="lg"
          >
            <Skeleton loading={loading}>
              {!loading && (
                <Menu
                  style={{ marginTop: 64 }}
                  // theme="dark"
                  mode="inline"
                  selectedKeys={[location.pathname.split("/")[2]]}
                  items={[
                    ...unassignedChats.data?.map((chat: any) => ({
                      key: chat.id,
                      icon: <UserAddOutlined />,
                      danger: true,
                      label: (
                        <Link to={chat.id.toString()}>{chat.customerName}</Link>
                      ),
                    })),
                    ...assignedChats.data?.map((chat: any) => ({
                      key: chat.id,
                      icon: <UserOutlined />,
                      label: (
                        <Link to={chat.id.toString()}>{chat.customerName}</Link>
                      ),
                    })),
                  ]}
                />
              )}
            </Skeleton>
          </Sider>
          <Content
            className={styles.content}
            style={sideCollapsed ? { marginLeft: 50 } : { marginLeft: 170 }}
          >
            <div style={{ padding: 10 }}>
              <Outlet />
            </div>
          </Content>
        </Layout>
      ) : (
        <h1>Log in to see the content</h1>
      )}
    </>
  );
}
