import React from "react";
import { useParams } from "react-router-dom";
import { useGetUnassignedChat } from "../hooks/useGet";
import { AssignButtons } from "./AssignButtons";
import ChatContent from "./ChatContent";

type Props = {};

export default function ChatOutlet({}: Props) {
  const params = useParams();
  let chatId = params.chatId ? parseInt(params.chatId) : 0;
  const unAssignedChats = useGetUnassignedChat();
  if (unAssignedChats.data?.some((chat: any) => chat.id === chatId)) {
    return <AssignButtons id={chatId} />;
  } else return <ChatContent chatId={chatId} />;
}
