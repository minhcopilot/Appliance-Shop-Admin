import { message } from "antd";
import axiosClient from "../config/axiosClient";
import React from "react";
import { Error } from "./useGet";
import { onlineManager, useMutation, useQueryClient } from "react-query";
import useAuth from "../../OnlineShop/hooks/useAuth";

const useAdd = (subject: string, silent?: boolean) => {
  // const [success, setSuccess] = React.useState(false);
  // const setRefresh = useRefresh((state) => state.setRefresh);
  const access_token = useAuth((state) => state.token);
  const add = async (data: any) => {
    const response = await axiosClient.post(subject, data, {
      headers: {
        Authorization: "Bearer " + access_token,
      },
    });
    return response.data;
  };
  const queryClient = useQueryClient();
  const result = useMutation<any, Error>(add, {
    onSuccess: (data) => {
      // queryClient.setQueryData([subject], (olddata: any) => [...olddata, data]);
      //api lại sai :/ trả thiếu category,supplier, mất công fetch lại :/)
      const newitemcat = queryClient
        .getQueryData<any[]>(["categories"])
        ?.find((value) => {
          return value.id === data.categoryId;
        });
      const newitemsup = queryClient
        .getQueryData<any[]>(["suppliers"])
        ?.find((value) => {
          return value.id === data.supplierId;
        });
      newitemcat
        ? queryClient.setQueryData([subject], (olddata: any) => [
            ...olddata,
            { ...data, category: newitemcat, supplier: newitemsup },
          ])
        : queryClient.invalidateQueries([subject]);
      console.log(queryClient.getQueryData([subject]));
      subject === "orders"
        ? !silent &&
          message.success({
            key: "addsubject",
            content: "Added order with ID: " + data.id,
          })
        : !silent &&
          message.success({
            key: "addsubject",
            content: "Added " + data.name + " with ID: " + data.id,
          });
      result.reset();
    },
    onError: (error) => {
      !silent &&
        message.error({
          key: "addsubject",
          content: error.response.data.message,
        });
    },
    retry: (failureCount, error) => {
      return Boolean(!error.response);
    },
  });
  React.useEffect(() => {
    result.isLoading &&
      (onlineManager.isOnline()
        ? !silent &&
          message.loading({
            key: "addsubject",
            content: "Submitting",
            duration: 0,
          })
        : !silent &&
          message.loading({
            key: "addsubject",
            content: "Lost Connection",
            duration: 0,
          })); // eslint-disable-next-line
  }, [result]);
  return result;
};

export default useAdd;
