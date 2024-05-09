import { useQuery, useQueryClient } from "react-query";
import axiosClient from "../../OnlineShop/config/axiosClient";
import useAuth from "../../OnlineShop/hooks/useAuth";
import { useSocket } from "../../socket";

export const useGetAssignedChat = () => {
  const token = useAuth((state) => state.token);
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
  return result;
};
export const useGetContent = (id: number | null) => {
  const token = useAuth((state) => state.token);
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
  return result;
};

export const useGetMessage = (id: string) => {
  const token = useAuth((state) => state.token);
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
  return result;
};
