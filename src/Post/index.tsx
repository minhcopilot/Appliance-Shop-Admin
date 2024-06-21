import React from "react";
import styles from "./Article.module.css";
// import Login, { Button } from "./Login";
// import Category from "./Category";
// import ButtonTabs from "../Session3/Tabs/ButtonTabs";
import { Alert, Layout, Menu, theme } from "antd";

import { Link, Outlet, useLocation } from "react-router-dom";
import Sider from "antd/es/layout/Sider";
import { MdOutlineCategory, MdOutlinePostAdd } from "react-icons/md";
import { Content } from "antd/es/layout/layout";
import { CommentOutlined } from "@ant-design/icons";
import useAuth from "../OnlineShop/hooks/useAuth";

export const Notice = () => {
  return (
    <Alert
      message="Informational Notes"
      description={<p></p>}
      type="info"
      showIcon
    />
  );
};

export default function Article() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [sideCollapsed, setSideCollapsed] = React.useState(false);
  const location = useLocation();
  const loggedInUser = useAuth().loggedInUser;
  return (
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
        <Menu
          style={{ marginTop: 64 }}
          // theme="dark"
          mode="inline"
          selectedKeys={[location.pathname.split("/")[2]]}
          items={[
            {
              key: "category",
              label: <Link to="category">Danh mục</Link>,
              icon: <MdOutlineCategory />,
            },
            {
              key: "post",
              label: <Link to="post">Bài viết</Link>,
              icon: <MdOutlinePostAdd />,
            },
            {
              key: "comment",
              label: <Link to="comment">Bình luận</Link>,
              icon: <CommentOutlined />,
            },
          ]}
        />
      </Sider>
      <Content
        className={styles.content}
        style={sideCollapsed ? { marginLeft: 50 } : { marginLeft: 170 }}
      >
        <div style={{ padding: 10 }}>
          {loggedInUser ? <Outlet /> : <h1>Đăng nhập để xem nội dung</h1>}
        </div>
      </Content>
    </Layout>
  );
}
