import { Button, Card, Form, Input, Space } from "antd";
import React from "react";
import { useSocket } from "../../socket";
import { useGetAssignedChat } from "../hooks/useGet";

type Props = { chatId: number };

export default function SendForm({ chatId }: Props) {
  const [chatForm] = Form.useForm();
  const socket = useSocket();
  const assignedChat = useGetAssignedChat();
  const currentChat = assignedChat.data?.find(
    (chat: any) => chat.id === chatId
  );
  const sendMessage = (data: any) => {
    socket.connect();
    socket.emit("employee-message", {
      type: "new-message",
      message: {
        chatId,
        type: "text",
        content: data.message,
      },
    });
    console.log("message sent to " + chatId + ": " + data.message);
    chatForm.resetFields();
  };
  return (
    <>
      {assignedChat.isSuccess && currentChat && currentChat.isFinished ? (
        <Card size="small" style={{ backgroundColor: "#d1d1d1" }}>
          This chat has finished
        </Card>
      ) : (
        <Form form={chatForm} onFinish={sendMessage} style={{ width: "100%" }}>
          <Space.Compact block>
            <Form.Item
              name="message"
              rules={[
                { required: true, message: "Please input your message!" },
              ]}
              style={{ width: "100%" }}
            >
              <Input autoFocus name="message" placeholder="Type a message" />
            </Form.Item>
            <Button type="primary" htmlType="submit">
              Send
            </Button>
          </Space.Compact>
        </Form>
      )}
    </>
  );
}
