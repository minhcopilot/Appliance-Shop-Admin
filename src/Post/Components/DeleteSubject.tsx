import React from "react";
import useDelete from "../hooks/useDelete";
import { Button, ButtonProps, Popconfirm, message } from "antd";
import { AiOutlineDelete } from "react-icons/ai";
import usePatchSubject from "../hooks/usePatch";
// import useGetSubjects from "../hooks/useGet";

interface Props extends ButtonProps {
  deleteId: any[];
  subject: string;
  title?: string;
  collapsed?: boolean;
}

export default function DeleteSubject({
  deleteId,
  subject,
  title,
  collapsed,
  ...props
}: Props) {
  const confirmDelete = useDelete(subject);

  const DeleteHandle = () => {
    deleteId.forEach((value) => {
      confirmDelete.mutate(value);
    });
    confirmDelete.isLoading &&
      message.loading({
        key: "deletesubject",
        content: "Loading",
      });
  };

  return (
    <Popconfirm
      placement="topRight"
      title={title}
      description={
        deleteId.length <= 1
          ? "Bạn có chắc muốn xóa mục đã chọn"
          : "Bạn có chắc muốn xóa những mục đã chọn?"
      }
      onConfirm={DeleteHandle}
      okText="Đồng ý"
      cancelText="Không"
    >
      <Button
        loading={confirmDelete.isLoading}
        icon={<AiOutlineDelete />}
        danger
        {...props}
      >
        {collapsed
          ? null
          : deleteId.length === 1
          ? "Xóa mục đã chọn"
          : "Xóa các mục đã chọn"}
      </Button>
    </Popconfirm>
  );
}
