import React from "react";
import { useSocket } from "../../socket";
import { Button, Space, notification } from "antd";
import { useLoading } from "../hooks/useLoading";

type Props = {
  notifKey?: string;
  id: number;
};

export const AssignButtons = ({ notifKey, id }: Props) => {
  const socket = useSocket();
  const { acceptLoading, setAcceptLoading } = useLoading((state) => state);
  const acceptAssign = (id: number) => {
    socket.connect();
    socket.emit("employee-message", { type: "chat-accepted", message: { id } });
    console.log("accepting chat id: " + id);
    setAcceptLoading(id);
  };

  return (
    <Space>
      {notifKey && (
        <Button type="link" onClick={() => notification.destroy()}>
          Từ chối tất cả
        </Button>
      )}
      <Button
        type="primary"
        onClick={() => {
          acceptAssign(id);
        }}
        loading={acceptLoading ? true : false}
      >
        Đồng ý
      </Button>
    </Space>
  );
};
