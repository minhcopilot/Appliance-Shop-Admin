import { message } from "antd";
import axiosClient from "../config/axiosClient";
import { Error } from "./useGet";
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
          content: "Đã xóa thành công",
        });
    },
    onError: (error) => {
      !silent &&
        message.error({
          key: "deletesubject",
          content: error.response.data.message || "Có lỗi xảy ra",
        });
    },
  });

  return result;
};

export default useDelete;
