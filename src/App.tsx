import React from "react";
import "./App.css";
import {
  Badge,
  Button,
  ConfigProvider,
  Layout,
  Menu,
  MenuProps,
  Result,
} from "antd";
import { Content, Header } from "antd/es/layout/layout";
import locale from "antd/locale/vi_VN";
import { Outlet, Link, useLocation } from "react-router-dom";
import Loginant from "./OnlineShop/Login/Loginant";
import useAuth from "./OnlineShop/hooks/useAuth";
import Logout from "./OnlineShop/Login/Logout";
import { GiDoctorFace } from "react-icons/gi";
import { serverMessageHandler, socketEstablished } from "./Chat/chatHandler";
import { useSocket } from "./socket";
import { useGetUnassignedChat } from "./Chat/hooks/useGet";
import { useQueryClient } from "react-query";

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
  const queryClient = useQueryClient();
  React.useEffect(() => {
    socketEstablished(socket);
    socket.on("server-message", serverMessageHandler);
    socket.on("new-message", (data: any) => {
      queryClient.setQueryData(["chatContent", data.chatId], (old: any) => [
        ...old,
        data,
      ]);
      console.log("new message received: " + data.content);
    });
    socket.on("assigned", (data: any) => {
      queryClient.setQueriesData("unassigned", (old: any) =>
        old.filter((chat: any) => chat.id !== data.message.id)
      );
      queryClient.setQueriesData("assigned", (old: any) => [
        ...old,
        data.message,
      ]);
    });
    socket.on("disconnected", (data) => {
      queryClient.setQueriesData("assigned", (old: any) => {
        return old.map((chat: any) => {
          if (chat.id === data) {
            return { ...chat, isFinished: true };
          }
          return chat;
        });
      });
    });

    console.log("socket listening");
    return () => {
      socket.off("new-message");
      socket.off("server-message");
      socket.off("assigned");
      socket.off("disconnected");
      console.log("socket off");
      // socket.disconnect();
      // console.log("socket disconnected");
    };
  }, []);
  React.useEffect(() => {
    !loggedInUser && socket.disconnect();
  }, [loggedInUser]);
  const unassignedChats = useGetUnassignedChat();
  const [unassignedChatsCount, setUnassignedChatsCount] = React.useState(0);
  React.useEffect(() => {
    unassignedChats.data &&
      setUnassignedChatsCount(unassignedChats.data.length);
  }, [unassignedChats.data]);
  return (
    <ConfigProvider locale={locale}>
      <Layout
        style={{
          backgroundImage:
            "url('https://png.pngtree.com/thumb_back/fw800/back_our/20190625/ourmid/pngtree-window-kitchen-small-fresh-home-appliance-poster-image_254040.jpg')",
        }}
      >
        <Header
          className="fixedHeader"
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
                label: (
                  <Link to="chat">
                    <Badge
                      count={unassignedChatsCount}
                      overflowCount={10}
                      size="small"
                    >
                      <p style={{ color: "white" }}>Chat</p>
                    </Badge>
                  </Link>
                ),
              },
            ]}
          />
          <HeaderContent />
        </Header>
        <Content style={{ marginTop: "64px" }}>
          <Outlet />
        </Content>
      </Layout>
    </ConfigProvider>
  );
}
