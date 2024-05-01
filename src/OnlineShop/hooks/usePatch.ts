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
          content: "Modified successfully",
        });
      // queryClient.setQueryData([subject], (olddata: any) =>
      //   olddata
      //     ? olddata.map((item: any) => {
      //         return item.id === data.id ? data : item;
      //       })
      //     : olddata
      // );
      queryClient.invalidateQueries([subject]);
      queryClient.invalidateQueries([subject, variables.id]);
      // queryClient.setQueryData([subject, variables.id], data);
      setPatchPopup(false);
      setCurrentId(null);
    },
  });
  return result;
};

// const usePatchSubject = (subject: string, data: any, id: number | null) => {
//   const [error, setError] = React.useState<null | string>(null);
//   const setRefresh = useRefresh((state) => state.setRefresh);
//   const token = useAuth((state) => state.token);
//   React.useEffect(() => {
//     const addData = async () => {
//       try {
//         message.loading({
//           key: "patchsubject",
//           content: "Loading",
//         });
//         const url = "/online-shop/" + subject + "/" + id;
//         const response = await axiosClient.patch(url, data, {
//           headers: {
//             Authorization: "Bearer " + token,
//           },
//         });
//         message.success({
//           key: "patchsubject",
//           type: "success",
//           content: "Modified successfully",
//         });
//         setError(null);
//         setRefresh();
//       } catch (error: any) {
//         setError(error.response.data.message);
//         message.destroy("patchsubject");
//       }
//     };
//     data && id && addData();
//   }, [data]);
//   return [error];
// };

export default usePatchSubject;
