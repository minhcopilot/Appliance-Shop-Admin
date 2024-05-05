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
      description={
        <p>
          You can't delete custormers, employees those are currently having
          orders, or categories with products.
          <br />
          Try to delete existing relative orders / products by using "Filter"
          and "Delete selected items" function first
        </p>
      }
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
              label: <Link to="category">Category</Link>,
              icon: <MdOutlineCategory />,
            },
            {
              key: "post",
              label: <Link to="post">Post</Link>,
              icon: <MdOutlinePostAdd />,
            },
            {
              key: "comment",
              label: <Link to="comment">Comment</Link>,
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
          {loggedInUser ? <Outlet /> : <h1>Log in to see the content</h1>}
        </div>
      </Content>
    </Layout>
  );
}
