import { useQuery } from "react-query";
import axiosClient from "../../OnlineShop/config/axiosClient";
import useAuth from "../../OnlineShop/hooks/useAuth";
import { useSocket } from "../../socket";
import React from "react";

export const useGetAssignedChat = () => {
  const token = useAuth((state) => state.token);
  const socket = useSocket();
  const getAssignedChat = async () => {
    try {
      const response = await axiosClient.get("/chat/assigned", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      return response.data;
    } catch (error) {
      console.error(error);
      return [];
    }
  };
  const result = useQuery<any, Error>("assigned", getAssignedChat);
  React.useEffect(() => {
    if (socket) {
      socket.on("assigned", (data: any) => {
        result.refetch();
        console.log("Assigned chat", data);
      });
    }
    return () => {
      socket?.off("assigned");
    };
  }, [socket]);
  return result;
};

export const useGetUnassignedChat = () => {
  const token = useAuth((state) => state.token);
  const socket = useSocket();
  const getUnassignedChat = async () => {
    try {
      const response = await axiosClient.get("/chat/unassigned", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      return response.data;
    } catch (error) {
      console.error(error);
      return [];
    }
  };
  const result = useQuery<any, Error>("unassigned", getUnassignedChat);
  React.useEffect(() => {
    if (socket) {
      socket.on("assigned", (data: any) => {
        result.refetch();
      });
    }
    return () => {
      socket?.off("unassigned");
    };
  }, [socket]);
  return result;
};
export const useGetContent = (id: number) => {
  const token = useAuth((state) => state.token);
  const socket = useSocket();
  const getMessage = async () => {
    try {
      const response = await axiosClient.get(`/chat/content/${id}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      return response.data;
    } catch (error) {
      console.error(error);
      return [];
    }
  };
  const result = useQuery<any, Error>(["chatContent", id], getMessage);
  React.useEffect(() => {
    if (socket) {
      socket.on("new-message", (data: any) => {
        result.refetch();
      });
    }
    return () => {
      socket?.off("new-message");
    };
  }, [socket]);
  return result;
};

export const useGetMessage = (id: string) => {
  const token = useAuth((state) => state.token);
  const socket = useSocket();
  const getMessages = async () => {
    try {
      const response = await axiosClient.get(`/chat/messages/${id}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      return response.data;
    } catch (error) {
      console.error(error);
      return [];
    }
  };
  const result = useQuery<any, Error>(["chatMessages", id], getMessages);
  React.useEffect(() => {
    if (socket) {
      socket.on("new-message", (data: any) => {
        result.refetch();
      });
    }
    return () => {
      socket?.off("new-message");
    };
  }, [socket]);
  return result;
};
