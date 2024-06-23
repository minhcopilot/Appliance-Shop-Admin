import React from "react";
import Message from "./Message";
import { Button, Card, Flex, FloatButton, Skeleton } from "antd";
import styles from "./ChatContent.module.css";
import { ArrowDownOutlined, LoadingOutlined } from "@ant-design/icons";
import { useGetAssignedChat, useGetContent } from "../hooks/useGet";
import SendForm from "./SendForm";
import { useSocket } from "../../socket";
import { useLoading } from "../hooks/useLoading";

type Props = { chatId: number };

export default function ChatContent({ chatId }: Props) {
  const socket = useSocket();
  const { disconnectLoading, setDisconnectLoading } = useLoading(
    (state) => state
  );
  let chatContent = useGetContent(chatId);
  const assignedChat = useGetAssignedChat();
  const currentChat =
    assignedChat.isSuccess &&
    assignedChat.data.find((chat: any) => chat.id === chatId);
  const latestMessage = React.useRef<HTMLDivElement>(null);
  const scrollToLatest = () => {
    latestMessage.current?.scrollIntoView({ behavior: "smooth" });
  };
  const disconnect = () => {
    socket.connect();
    socket.emit("employee-message", {
      type: "close-chat",
      message: chatId,
    });
    console.log("disconnecting chat id: " + chatId);
    setDisconnectLoading(chatId);
  };

  React.useEffect(() => {
    scrollToLatest();
  }, [chatContent.data]);
  return (
    <Card
      title={currentChat?.customerName + " - " + currentChat?.phoneNumber}
      extra={
        <Button
          type="primary"
          danger
          onClick={disconnect}
          loading={disconnectLoading ? true : false}
          disabled={currentChat?.isFinished}
        >
          Ngắt kết nối
        </Button>
      }
    >
      <Flex
        vertical
        justify="space-between"
        gap={10}
        style={{ width: "100%", height: "calc(100vh - 200px)" }}
      >
        <Skeleton loading={chatContent.isLoading} active>
          <Flex vertical className={styles.container} gap={10}>
            <FloatButton
              icon={<ArrowDownOutlined />}
              onClick={scrollToLatest}
              tooltip="Xem tin nhắn mới nhất"
              style={{
                position: "absolute",
                right: 35,
                bottom: 80,
                opacity: 0.7,
              }}
            />
            {chatContent.isSuccess &&
              chatContent.data?.map((message: any) => (
                <Message
                  key={message._id || Math.random().toString(16).slice(2)}
                  message={message}
                />
              ))}
            <div
              ref={latestMessage}
              className="h-[1px] block grow-1 shrink-0"
            />
          </Flex>
        </Skeleton>
        {chatId !== 0 && <SendForm chatId={chatId} />}
      </Flex>
    </Card>
  );
}
