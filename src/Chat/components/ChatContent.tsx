import React from "react";
import Message from "./Message";
import { Card, Flex, FloatButton, Skeleton, Space, Spin } from "antd";
import styles from "./ChatContent.module.css";
import { ArrowDownOutlined } from "@ant-design/icons";
import { useGetContent } from "../hooks/useGet";
import SendForm from "./SendForm";

type Props = { chatId: number };

export default function ChatContent({ chatId }: Props) {
  let chatContent = useGetContent(chatId);
  const latestMessage = React.useRef<HTMLDivElement>(null);
  const scrollToLatest = () => {
    latestMessage.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToLatest();
  }, [chatContent.data]);
  return (
    <Flex
      vertical
      justify="space-between"
      gap={10}
      style={{ width: "100%", height: "calc(100vh - 84px)" }}
    >
      <Skeleton loading={chatContent.isLoading} active>
        <Flex vertical className={styles.container} gap={10}>
          <FloatButton
            icon={<ArrowDownOutlined />}
            onClick={scrollToLatest}
            tooltip="Scroll to latest"
            style={{
              position: "absolute",
              right: 24,
              bottom: 80,
              opacity: 0.5,
            }}
          />
          {chatContent.isSuccess &&
            chatContent.data?.map((message: any) => (
              <Message
                key={message._id || Math.random().toString(16).slice(2)}
                message={message}
              />
            ))}
          <div ref={latestMessage} />
        </Flex>
      </Skeleton>
      {chatId !== 0 && <SendForm chatId={chatId} />}
    </Flex>
  );
}
