import React, { useEffect, useState } from "react";
import { Form, Input, DatePicker, Button, Select, message } from "antd";
import axiosClient from "../config/axiosClient";

interface AddVoucherForCustomerFormProps {
  customerId: number;
  onSuccess: () => void;
}
interface Voucher {
  id: number;
  voucherCode: string;
  discountPercentage: number;
  maxUsageCount: number;
  remainingUsageCount: number;
  expiryDate: Date;
  startDate: Date;
  voucherType: string;
}
const AddVoucherForCustomerForm: React.FC<AddVoucherForCustomerFormProps> = ({
  customerId,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await axiosClient.get("/vouchers");
        const fetchedVouchers = response.data.map((voucher: any) => ({
          ...voucher,
          expiryDate: new Date(voucher.expiryDate),
          startDate: new Date(voucher.startDate),
        }));
        setVouchers(fetchedVouchers);
      } catch (error) {
        console.error("Error fetching vouchers:", error);
      }
    };

    fetchVouchers();
  }, []);
  // Lọc các voucher còn hạn sử dụng
  const currentDate = new Date();
  const validVouchers = vouchers.filter(
    (voucher) =>
      voucher.expiryDate >= currentDate &&
      voucher.startDate <= currentDate &&
      voucher.remainingUsageCount > 0 &&
      voucher.voucherType === "CUSTOMER"
  );
  console.log("««««« validVouchers »»»»»", validVouchers);
  form.setFieldValue("customerId", customerId);
  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      const resp = await axiosClient.post(
        "/vouchers/add-voucher-for-customer",
        values
      );
      if (resp.status === 200) {
        message.success("Thêm voucher cho khách hàng thành công");
        onSuccess();
        setLoading(false);
      } else {
        message.error("Thêm voucher cho khách hàng thất bại");
        setLoading(false);
      }
    } catch (error) {
      message.error("Error adding voucher for customer");
      setLoading(false);
    }
  };

  return (
    <Form form={form} onFinish={handleSubmit} layout="vertical">
      <Form.Item
        name="customerId"
        label="Mã khách hàng"
        rules={[
          { type: "number" },
          { required: true, message: "Hãy chọn khách hàng" },
        ]}
      >
        <Input disabled></Input>
      </Form.Item>
      <Form.Item
        name="voucherCode"
        label="Voucher"
        rules={[
          { type: "string" },
          { required: true, message: "Hãy chọn Voucher" },
        ]}
      >
        <Select
          options={validVouchers.map((item) => {
            return {
              value: item.voucherCode,
              label: item?.voucherCode,
            };
          })}
        ></Select>
      </Form.Item>
      <Form.Item>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button type="primary" htmlType="submit" loading={loading}>
            Tạo voucher
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default AddVoucherForCustomerForm;
