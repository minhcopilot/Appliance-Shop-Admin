import { message, notification } from "antd";
import { AssignButtons } from "./components/AssignButtons";

export type socketData = {
  type: string;
  message: any;
};

export const socketEstablished = (socket: any) => {
  socket.connect();
  socket.emit("employee-message", { type: "employee-connected" });
  console.log("socket connected");
};

const openNotification = (customerName: string, id: number) => {
  const key = `newchat-${id}`;
  notification.open({
    message: `New chat from ${customerName}`,
    description: "Do you want to accept this chat?",
    btn: <AssignButtons id={id} key={key} />,
    duration: 5,
    key,
  });
  console.log("new chat id: " + id);
};

export const serverMessageHandler = (data: socketData) => {
  data.type === "chat-started" &&
    openNotification(data.message.customerName, data.message.id);
  data.type === "error" && message.error(data.message);
};
