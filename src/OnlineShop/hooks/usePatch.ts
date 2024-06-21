import { message } from "antd";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import axiosClient from "../config/axiosClient";
// import React from "react";
import useAuth from "./useAuth";
import { useMutation, useQueryClient } from "react-query";
import { Error } from "./useGet";

interface currentIdInterface {
  currentId: number | null;
  setCurrentId: (id: number | null) => void;
}

export const useCurrentId = create<currentIdInterface>()(
  devtools((set) => ({
    currentId: null,
    setCurrentId: (id) => set((state) => ({ currentId: id })),
  }))
);

interface patchPopupInterface {
  patchPopup: boolean;
  setPatchPopup: (popup: boolean) => void;
}

export const usePatchPopup = create<patchPopupInterface>()(
  devtools((set) => ({
    patchPopup: false,
    setPatchPopup: (popup) => set((state) => ({ patchPopup: popup })),
  }))
);

const usePatchSubject = (
  subject: string,
  // id: number | null,
  silent?: boolean
) => {
  const token = useAuth((state) => state.token);
  const setPatchPopup = usePatchPopup((state) => state.setPatchPopup);
  const setCurrentId = useCurrentId((state) => state.setCurrentId);

  const patch = async ({ data, id }: any) => {
    const url = subject + "/" + id;
    const response = await axiosClient.patch(url, data, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return response.data;
  };
  const queryClient = useQueryClient();
  const result = useMutation<any, Error>(patch, {
    onSuccess: (data, variables: any) => {
      !silent &&
        message.success({
          key: "patchsubject",
          type: "success",
          content: "Sửa thành công",
        });
      queryClient.invalidateQueries([subject]);
      queryClient.invalidateQueries([subject, variables.id]);
      setPatchPopup(false);
      setCurrentId(null);
    },
  });
  return result;
};

export default usePatchSubject;
