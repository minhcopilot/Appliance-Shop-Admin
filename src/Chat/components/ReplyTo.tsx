import React from "react";
import { useGetMessage } from "../hooks/useGet";
import { Button, Card } from "antd";
import { useNavigate } from "react-router-dom";

type Props = {
  id: string;
};

export default function ReplyTo({ id }: Props) {
  let message = useGetMessage(id).data;
  const navigate = useNavigate();
  return (
    <>
      <p>Replying to</p>
      <Card size="small" style={{ backgroundColor: "grey" }}>
        {message.type === "text" && message.content}
        {message.type === "image" && <img src={message.content} alt="image" />}
        {message.type === "product" ||
          ("order" && (
            <Button onClick={() => navigate(message.content)}>
              Go to {message.type}
            </Button>
          ))}
      </Card>
    </>
  );
}
