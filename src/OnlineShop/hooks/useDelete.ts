import { message } from "antd";
import axiosClient from "../config/axiosClient";
import { Error } from "./useGet";
import useAuth from "./useAuth";
import { useMutation, useQueryClient } from "react-query";

const useDelete = (subject: string, silent?: boolean) => {
  const token = useAuth((state) => state.token);
  const queryClient = useQueryClient();

  const Delete = async (ids: any) => {
    const url = subject + "/" + ids;
    const response = await axiosClient.delete(url, {
      headers: {
        Authorization: "Bearer " + token,
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
          content: "Đã xóa",
        });
    },
    onError: (error) => {
      !silent &&
        message.error({
          key: "deletesubject",
          content: error.response.data.message || "Có lỗi xảy ra khi xóa",
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
