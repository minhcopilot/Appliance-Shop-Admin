import { Button, Input, Space } from "antd";
import React from "react";
import { useSocket } from "../../socket";
import { set } from "react-hook-form";

type Props = { chatId: number };

export default function SendForm({ chatId }: Props) {
  const [message, setMessage] = React.useState("");
  const socket = useSocket();
  const sendMessage = () => {
    socket.connect();
    socket.emit("employee-message", {
      type: "new-message",
      message: {
        chatId,
        type: "text",
        content: message,
      },
    });
    setMessage("");
  };
  return (
    <Space.Compact style={{ width: "100%" }}>
      <Input
        value={message}
        onChange={(e) => {
          setMessage(e.currentTarget.value);
        }}
        placeholder="Type a message"
      />
      <Button type="primary" onClick={sendMessage}>
        Send
      </Button>
    </Space.Compact>
  );
}
