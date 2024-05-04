import { message } from "antd";
import axiosClient from "../config/axiosClient";
// import React from "react";
import { Error } from "./useGet";
// import { useCurrentId } from "./usePatch";
import { useMutation, useQueryClient } from "react-query";
import useAuth from "../../OnlineShop/hooks/useAuth";

const useDelete = (subject: string, silent?: boolean) => {
  const access_token = useAuth((state) => state.token);
  const queryClient = useQueryClient();

  const Delete = async (ids: any) => {
    const url = subject + "/" + ids;
    const response = await axiosClient.delete(url, {
      headers: {
        Authorization: "Bearer " + access_token,
      },
    });
    return response.data;
  };
  const result = useMutation<any, Error>(Delete, {
    onSuccess: (data, variable) => {
      queryClient.setQueryData([subject], (olddata: any) => {
        return olddata.filter((item: any) => {
          return item.id !== variable;
        });
      });
      !silent &&
        message.success({
          key: "deletesubject",
          content: "Deleted",
        });
    },
    onError: (error) => {
      !silent &&
        message.error({
          key: "deletesubject",
          content: error.response.data.message,
        });
    },
  });
  // result.isLoading &&
  //   message.loading({
  //     key: "deletesubject",
  //     content: "Loading",
  //   });

  return result;
};

export default useDelete;
