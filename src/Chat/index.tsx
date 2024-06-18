import React from "react";
import styles from "./Chat.module.css";
// import Login, { Button } from "./Login";
// import Category from "./Category";
// import ButtonTabs from "../Session3/Tabs/ButtonTabs";
import { Flex, Layout, Menu, Skeleton, Spin, theme } from "antd";

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
import ChatSearch from "./components/ChatSearch";
import { set } from "react-hook-form";

export default function Chat() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [sideCollapsed, setSideCollapsed] = React.useState(false);
  const location = useLocation();
  const loggedInUser = useAuth().loggedInUser;
  const assignedChats = useGetAssignedChat();
  const unassignedChats = useGetUnassignedChat();
  const [searchChats, setSearchChats] = React.useState<any>([]);
  const loading = !(assignedChats.isSuccess && unassignedChats.isSuccess);
  React.useEffect(() => {
    setSearchChats(assignedChats?.data);
  }, [assignedChats?.data]);
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
                <Flex style={{ marginTop: 64 }} vertical gap={10}>
                  <ChatSearch
                    assignedChats={assignedChats}
                    setSearchChat={setSearchChats}
                  />
                  <Menu
                    // theme="dark"
                    mode="vertical"
                    selectedKeys={[location.pathname.split("/")[2]]}
                    items={[
                      ...unassignedChats.data?.map((chat: any) => ({
                        key: chat.id,
                        icon: <UserAddOutlined />,
                        danger: true,
                        label: (
                          <Link to={chat.id.toString()}>
                            {chat.customerName}
                          </Link>
                        ),
                      })),
                      ...searchChats?.map((chat: any) => ({
                        key: chat.id,
                        icon: <UserOutlined />,
                        label: (
                          <Link to={chat.id.toString()}>
                            {chat.customerName}
                          </Link>
                        ),
                      })),
                    ]}
                  />
                </Flex>
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
