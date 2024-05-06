import React from "react";
import { useParams } from "react-router-dom";
import { useGetContent } from "../hooks/useGet";
import Message from "./Message";
import { Space, Spin } from "antd";
import SendForm from "./SendForm";

type Props = {};

export default function ChatContent({}: Props) {
  const params = useParams();
  let chatId = params.chatId ? parseInt(params.chatId) : 0;
  let chatContent = useGetContent(chatId);
  return (
    <Space direction="vertical" style={{ height: "100%", width: "100%" }}>
      {chatContent.isLoading && <Spin />}
      {chatContent.isSuccess && (
        <Space direction="vertical" style={{ height: "100%", width: "100%" }}>
          {chatContent.data.map((message: any) => (
            <Message message={message} />
          ))}
        </Space>
      )}
      {chatId !== 0 && <SendForm chatId={chatId} />}
    </Space>
  );
}
