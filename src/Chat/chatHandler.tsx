import { message, notification } from "antd";
import { AssignButtons } from "./components/AssignButtons";

export type socketData = {
  type: string;
  message: any;
};

const openNotification = (customerName: string, id: number) => {
  const key = `open${Date.now()}`;
  notification.open({
    message: `New chat from ${customerName}`,
    description: "Do you want to accept this chat?",
    btn: <AssignButtons id={id} customerName={customerName} key={key} />,
    key,
  });
};

export const serverMessageHandler = (data: socketData) => {
  data.type === "chat-started" &&
    openNotification(data.message.customerName, data.message.id);
  data.type === "error" && message.error(data.message);
};
