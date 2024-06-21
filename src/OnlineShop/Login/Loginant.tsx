import React, { useState } from "react";
// import styles from "./Login.module.css";
import { Button, Form, Input, Modal } from "antd";
import useAuth from "../hooks/useAuth";
import { useQueryClient } from "react-query";

// type Props = { setIsLoggedIn: (data: any) => void; messageApi: any };

// interface loginFormInput {
//   username: string;
//   password: string;
// }

export default function Loginant() {
  const login = useAuth((state) => state.login);
  const [loginPopup, setLoginPopup] = useState(false);
  const [loginform] = Form.useForm();
  const queryClient = useQueryClient();
  const handleLogin = async (data: any) => {
    await login(data);
    queryClient.invalidateQueries("assigned");
    queryClient.invalidateQueries("unassigned");
    setLoginPopup(false);
  };
  return (
    <>
      <Button type="primary" onClick={() => setLoginPopup(true)}>
        Đăng nhập
      </Button>
      <Modal
        open={loginPopup}
        onCancel={() => setLoginPopup(false)}
        onOk={() => loginform.submit()}
        okText="Đăng nhập"
        title="Đăng nhập"
      >
        <Form onFinish={handleLogin} form={loginform}>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Vui lòng không để trống email" },
              { type: "email" },
              { max: 30, message: "Email quá dài" },
            ]}
          >
            <Input name="email" type="email" max={30}></Input>
          </Form.Item>
          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu" },
              { type: "string" },
              { max: 30, message: "Mật khẩu quá dài" },
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
