import { message } from "antd";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import axiosClient from "../config/axiosClient";
import React from "react";
import { useQuery, useQueryClient } from "react-query";
import { AxiosError, AxiosResponse } from "axios";
import useAuth from "../../OnlineShop/hooks/useAuth";

interface ErrorResponse extends AxiosResponse {
  data: { message: string[]; statusCode: number };
}

export interface Error extends AxiosError {
  response: ErrorResponse;
}

declare module "react-query" {
  interface Register {
    defaultError: Error;
  }
}

interface refreshInterface {
  refresh: boolean;
  setRefresh: () => void;
}

export const useRefresh = create<refreshInterface>()(
  devtools(
    (set) => ({
      refresh: false,
      setRefresh: () => set((state) => ({ refresh: !state.refresh })),
    }),
    { name: "refresh" }
  )
);

export const useGetSubject = (
  subject: string,
  id: string | null,
  silent?: boolean
) => {
  const queryClient = useQueryClient();
  const url = subject + "/" + id;
  const access_token = useAuth((state) => state.token);
  const getSubject = async (subject: string, id: string | null) => {
    const response = await axiosClient.get(url, {
      headers: {
        Authorization: "Bearer " + access_token,
      },
    });
    return response.data;
  };
  const result = useQuery<any, Error>(
    [subject, id],
    () => getSubject(subject, id),
    {
      enabled: Boolean(id),
      retry: false,
      onSuccess: (data) => {
        queryClient.setQueryData([subject], (olddata: any) =>
          olddata.map((item: any) => {
            return item.id === data.id ? data : item;
          })
        );
      },
    }
  );
  React.useEffect(() => {
    result.isLoading &&
      !silent &&
      message.loading({
        key: "geterror",
        content: "Đang kết nối",
        duration: 0,
      });
    result.isSuccess && message.destroy("geterror");
    result.isError &&
      (result.error.response
        ? !silent &&
          message.error({
            key: "geterror",
            content: result.error.response.data.message || "Có lỗi",
          })
        : !silent &&
          message.loading({
            key: "geterror",
            content: "Mất kết nối",
            duration: 0,
          })); // eslint-disable-next-line
  }, [result]);
  return result;
};

const useGetSubjects = (subject: string) => {
  const access_token = useAuth((state) => state.token);
  const getSubjects = async (subject: string) => {
    const response = await axiosClient.get(subject, {
      headers: {
        Authorization: "Bearer " + access_token,
      },
    });
    return response.data;
  };
  return useQuery<any[], Error>([subject], () => getSubjects(subject));
};

export default useGetSubjects;
