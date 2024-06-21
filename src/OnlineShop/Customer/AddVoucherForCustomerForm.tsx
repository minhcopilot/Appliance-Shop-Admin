import React from "react";
import { Form, Button, Select } from "antd";
import useGetSubjects from "../hooks/useGet";

interface AddVoucherForCustomerFormProps {
  customerId: number;
  onSubmit: (values: any) => void;
}

const AddVoucherForCustomerForm: React.FC<AddVoucherForCustomerFormProps> = ({
  customerId,
  onSubmit,
}) => {
  const [form] = Form.useForm();
  const customers = useGetSubjects("customers");
  const vouchers = useGetSubjects("vouchers");
  const handleSubmit = (values: any) => {
    onSubmit({ ...values, customerId });
  };

  return (
    <Form form={form} onFinish={handleSubmit} layout="vertical">
      <Form.Item
        name="customerId"
        label="Khách hàng"
        rules={[
          { type: "number" },
          { required: true, message: "Hãy chọn khách hàng" },
        ]}
      >
        <Select
          options={customers.data?.map((item) => {
            return {
              value: item.id,
              label: item?.id,
            };
          })}
        ></Select>
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
          options={vouchers.data?.map((item) => {
            return {
              value: item.voucherCode,
              label: item?.voucherCode,
            };
          })}
        ></Select>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Tạo voucher
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddVoucherForCustomerForm;
