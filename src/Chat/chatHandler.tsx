import { message, notification } from "antd";
import { AssignButtons } from "./components/AssignButtons";
import { useSocket } from "../socket";
import { useQueryClient } from "react-query";

export type socketData = {
  type: string;
  message: any;
};

export const socketEstablished = (socket: any) => {
  if (!socket.connected) {
    socket.connect();
    socket.emit("employee-message", { type: "employee-connected" });
  }
  console.log("socket connected");
};

const openNotification = (customerName: string, id: number) => {
  const key = `open${Date.now()}`;
  notification.open({
    message: `New chat from ${customerName}`,
    description: "Do you want to accept this chat?",
    btn: <AssignButtons id={id} key={key} />,
    duration: 10,
    key,
  });
  console.log("new chat id: " + id);
};

const serverMessageHandler = (data: socketData) => {
  data.type === "chat-started" &&
    openNotification(data.message.customerName, data.message.id);
  data.type === "error" && message.error(data.message);
};

export const useSocketHandler = () => {
  const queryClient = useQueryClient();
  const socket = useSocket();
  socketEstablished(socket);
  socket.on("server-message", serverMessageHandler);
  socket.on("new-message", (data: any) => {
    queryClient.setQueryData(["chatContent", data.chatId], (old: any) => [
      ...old,
      data,
    ]);
    console.log("new message received: " + data.content);
  });
  socket.on("assigned", (data: any) => {
    queryClient.setQueriesData("assigned", (old: any) =>
      old.filter((chat: any) => chat.id !== data.message.id)
    );
    queryClient.setQueriesData("unassigned", (old: any) => [
      ...old,
      data.message,
    ]);
  });
  socket.on("disconnected", (data) => {
    queryClient.setQueriesData("assigned", (old: any) => {
      return old.map((chat: any) => {
        if (chat.id === data) {
          return { ...chat, isFinished: true };
        }
        return chat;
      });
    });
  });

  console.log("socket listening");
  return () => {
    socket.off("new-message");
    socket.off("server-message");
    socket.off("assigned");
    socket.off("disconnected");
  };
};
