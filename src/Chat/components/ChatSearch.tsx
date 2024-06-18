import { Input } from "antd";
import React from "react";

type Props = {
  assignedChats: any;
  setSearchChat: (data: any) => void;
};

export default function ChatSearch({ assignedChats, setSearchChat }: Props) {
  const handleSearch = (e: any) => {
    const value = e.target.value;
    const searchResult = assignedChats?.data.filter(
      (chat: any) =>
        chat?.customerName?.toLowerCase().includes(value.toLowerCase()) ||
        chat?.phoneNumber?.includes(value)
    );
    setSearchChat(searchResult);
  };
  return (
    <Input
      placeholder="Tìm kiếm"
      onChange={handleSearch}
      style={{ margin: 5, width: "calc(100% - 10px)", position: "sticky" }}
    />
  );
}
