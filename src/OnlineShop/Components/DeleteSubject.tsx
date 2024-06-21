import useDelete from "../hooks/useDelete";
import { Button, ButtonProps, Popconfirm, message } from "antd";
import { AiOutlineDelete } from "react-icons/ai";
import usePatchSubject from "../hooks/usePatch";

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
        content: "Đang xóa...",
      });
  };

  return (
    <Popconfirm
      placement="topRight"
      title={title}
      description={
        deleteId.length <= 1
          ? subject === "orders"
            ? "Bạn có chắc muốn xóa đơn hàng này? Điều này sẽ xóa chi tiết đơn hàng trước"
            : "Bạn có chắc muốn xóa mục đã chọn"
          : subject === "orders"
          ? "Bạn có chắc muốn xóa những đơn hàng này? Điều này sẽ xóa chi tiết đơn hàng trước"
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
