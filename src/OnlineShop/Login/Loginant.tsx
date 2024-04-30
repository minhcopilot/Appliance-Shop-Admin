import React, { useState } from "react";
// import styles from "./Login.module.css";
import { Button, Form, Input, Modal } from "antd";
import useAuth from "../hooks/useAuth";

// type Props = { setIsLoggedIn: (data: any) => void; messageApi: any };

// interface loginFormInput {
//   username: string;
//   password: string;
// }

export default function Loginant() {
  const login = useAuth((state) => state.login);
  const [loginPopup, setLoginPopup] = useState(false);
  const [loginform] = Form.useForm();
  return (
    <>
      <Button type="primary" onClick={() => setLoginPopup(true)}>
        Login
      </Button>
      <Modal
        open={loginPopup}
        onCancel={() => setLoginPopup(false)}
        onOk={() => loginform.submit()}
        okText="Login"
        title="Login"
      >
        <Form onFinish={login} form={loginform}>
          <Form.Item
            name="email"
            label="Username"
            rules={[
              { required: true, message: "Please input your username" },
              { type: "email" },
              { max: 30, message: "Username is too long" },
            ]}
          >
            <Input name="email" type="email" max={30}></Input>
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: "Please input your password" },
              { type: "string" },
              { max: 30, message: "Password is too long" },
            ]}
          >
            <Input.Password
              name="password"
              type="password"
              max={30}
            ></Input.Password>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
