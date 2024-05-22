import React from "react";
import { useSocket } from "../../socket";
import { Button, Space, notification } from "antd";

type Props = {
  key?: string;
  id: number;
};

export const AssignButtons = ({ key, id }: Props) => {
  const socket = useSocket();
  const acceptAssign = (id: number) => {
    socket.connect();
    socket.emit("employee-message", { type: "chat-accepted", message: { id } });
    key && notification.destroy(key);
  };

  return (
    <Space>
      {key && (
        <Button type="link" onClick={() => notification.destroy()}>
          Reject All
        </Button>
      )}
      <Button
        type="primary"
        onClick={() => {
          acceptAssign(id);
        }}
      >
        Accept
      </Button>
    </Space>
  );
};
