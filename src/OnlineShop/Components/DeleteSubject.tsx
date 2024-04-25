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
  // const deleteOrder = useDelete("orders");
  // const orders = useGetSubjects("orders");
  const patch = usePatchSubject("orders", true);
  const EmptyOrderDetail = async (data: any, id: any) => {
    const passdata: any = { data: data, id: id };
    try {
      await patch.mutateAsync(passdata);
    } catch (error) {
      console.log(error);
    } finally {
      confirmDelete.mutate(id);
    }
  };
  const DeleteHandle = () => {
    deleteId.forEach((value) => {
      subject === "orders"
        ? EmptyOrderDetail({ orderDetails: [] }, value)
        : confirmDelete.mutate(value);
    });
    confirmDelete.isLoading &&
      message.loading({
        key: "deletesubject",
        content: "Loading",
      });
  };
  // hàm delete product mà đang bug
  // const emptyOrder = async (id: any) => {
  //   const matchOrders: any[] = [];
  //   orders.isSuccess &&
  //     orders.data?.map((value) => {
  //       value.orderDetails.some((value: any) => {
  //         return value.product.id == id;
  //       }) && matchOrders.push(value.id);
  //     });
  //   console.log(matchOrders);
  //   try {
  //     const todo = await matchOrders?.forEach((value: any) => {
  //       EmptyOrderDetail({ orderDetails: [] }, value.id);
  //       deleteOrder.mutate(value);
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     confirmDelete.mutate(id);
  //   }
  // };

  return (
    <Popconfirm
      placement="topRight"
      title={title}
      description={
        deleteId.length <= 1
          ? subject === "orders"
            ? "Are you sure to delete this? This will empty order detail first"
            : "Are you sure to delete this?"
          : subject === "orders"
          ? "Are you sure to delete those? This will empty order detail first"
          : "Are you sure to delete those?"
      }
      onConfirm={DeleteHandle}
      okText="Yes"
      cancelText="No"
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
          ? "Delete"
          : "Delete selected items"}
      </Button>
    </Popconfirm>
  );
}
