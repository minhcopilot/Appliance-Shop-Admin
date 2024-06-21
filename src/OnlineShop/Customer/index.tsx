import React, { useState } from "react";
// import styles from "./Customer.module.css";
import { Button, DatePicker, Form, Input, Modal, Select, Table } from "antd";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import customParseFormat from "dayjs/plugin/customParseFormat";
import type { ColumnsType } from "antd/es/table";
import AddVoucherForCustomerForm from "./AddVoucherForCustomerForm";
import TextArea from "antd/es/input/TextArea";
import SubjectTemplate from "../Components/SubjectTemplate";
import axiosClient from "../config/axiosClient";
import useGetSubjects from "../hooks/useGet";
// type Props = {};

dayjs.extend(customParseFormat);
dayjs.extend(utc);
const dateFormat = "YYYY-MM-DD";

interface addschemaInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  address: string;
  birthday?: string;
}

const CustomerForm = ({
  form,
  onFinish,
  initialValues,
}: {
  form?: any;
  onFinish?: (data: any) => void;
  initialValues?: addschemaInput;
}) => {
  return (
    <Form
      form={form}
      onFinish={onFinish}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 8 }}
    >
      <Form.Item
        name="firstName"
        label="Họ và tên đệm"
        rules={[
          { type: "string" },
          { required: true, message: "Họ và tên đệm không được bỏ trống" },
          { max: 100, message: "Tên khách hàng không được quá dài" },
        ]}
        initialValue={initialValues && initialValues.firstName}
      >
        <Input name="firstName" type="text"></Input>
      </Form.Item>
      <Form.Item
        name="lastName"
        label="Tên"
        rules={[
          { type: "string" },
          { required: true, message: "Tên khách hàng không được bỏ trống" },
          { max: 100, message: "Tên khách hàng không được quá dài" },
        ]}
        initialValue={initialValues && initialValues.lastName}
      >
        <Input name="lastName" type="text"></Input>
      </Form.Item>
      <Form.Item
        name="email"
        label="Email"
        rules={[
          { type: "email", message: "Email không hợp lệ" },
          { required: true, message: "Email không được bỏ trống" },
          { max: 300, message: "Email không được quá dài" },
        ]}
        initialValue={initialValues && initialValues.email}
      >
        <Input name="email" type="text"></Input>
      </Form.Item>
      <Form.Item
        name="password"
        label="Mật khẩu"
        rules={[
          { type: "string", message: "Mật khẩu không hợp lệ" },
          { required: true, message: "Mật khẩu không được bỏ trống" },
          { max: 500, message: "Mật khẩu không được quá dài" },
        ]}
        initialValue={initialValues && initialValues.password}
      >
        <Input name="password" type="password"></Input>
      </Form.Item>
      <Form.Item
        name="address"
        label="Địa chỉ"
        rules={[
          { type: "string" },
          { max: 300, message: "Địa chỉ không được quá dài" },
        ]}
        initialValue={initialValues && initialValues.address}
      >
        <TextArea name="email" autoSize></TextArea>
      </Form.Item>
      <Form.Item
        name="phoneNumber"
        label="Số điện thoại"
        rules={[
          { type: "string", message: "Số điện thoại không hợp lệ" },
          { max: 12, message: "Số điện thoại không hợp lệ" },
          {
            pattern: /^((\+84|0)[2|3|5|7|8|9])+([0-9]{8})\b/,
            message: "Số điện thoại không hợp lệ",
          },
        ]}
        initialValue={initialValues && initialValues.phoneNumber}
      >
        <Input addonBefore="+84" name="phoneNumber" type="number"></Input>
      </Form.Item>
      <Form.Item
        name="birthday"
        label="Ngày sinh"
        rules={[
          { type: "date", message: "Ngày sinh không hợp lệ" },
          // { required: true, message: "Birthday is required" },
        ]}
        initialValue={
          initialValues && initialValues.birthday
            ? dayjs(initialValues.birthday, "YYYY-MM-DD")
            : undefined
        }
      >
        <DatePicker format={"YYYY-MM-DD"} name="birthday" />
      </Form.Item>
    </Form>
  );
};

interface CustomerType extends addschemaInput {
  key: React.Key;
  id: number;
  customerId: number;
  totalOrderValue: number;
}

const Customerant = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [customer, setCustomer] = React.useState<CustomerType[]>([]);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(
    null
  );
  const defaultColumns: ColumnsType<CustomerType> = [
    {
      title: "Tên khách hàng",
      // dataIndex: "firstName",
      key: "Name",
      render: (value, record, index) => {
        return record.firstName + " " + record.lastName;
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      responsive: ["lg"],
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      responsive: ["sm"],
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      render: (value, record, index) => {
        return record.address
          ? `${record.address.slice(0, 50)}${
              record.address.length > 50 ? "..." : ""
            } `
          : null;
      },
      responsive: ["md"],
    },
    {
      title: "Ngày sinh",
      dataIndex: "birthday",
      key: "birthday",
      render: (text: any, record: CustomerType, index: number) => {
        return (
          <>{record.birthday && dayjs(record.birthday).format(dateFormat)}</>
        );
      },
      responsive: ["xl"],
    },
  ];

  const customerColumns: ColumnsType<any> = [
    {
      title: "Mã khách hàng",
      dataIndex: "customerId",
      key: "customerId",
    },
    {
      title: "Tên khách hàng",
      // dataIndex: "firstName",
      key: "Name",
      render: (value, record, index) => {
        return record.firstName + " " + record.lastName;
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      responsive: ["lg"],
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      responsive: ["sm"],
    },
    {
      title: "Ngày sinh",
      dataIndex: "birthday",
      key: "birthday",
      render: (text: any, record: CustomerType, index: number) => {
        return (
          <>{record.birthday && dayjs(record.birthday).format(dateFormat)}</>
        );
      },
      responsive: ["xl"],
    },
    {
      title: "Tổng tiền đơn hàng",
      dataIndex: "totalOrderValue",
      key: "totalOrderValue",
      responsive: ["xl"],
      render: (text: any, record: CustomerType, index: number) => {
        const formattedValue = new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(record.totalOrderValue);
        return <>{formattedValue}</>;
      },
    },
    {
      title: "Thêm voucher",
      key: "addVoucher",
      render: (text: any, record: CustomerType, index: number) => {
        return (
          <>
            <Button
              type="primary"
              onClick={() => {
                showModal(record.customerId);
              }}
            >
              Thêm voucher
            </Button>
            <Modal
              title="Thêm voucher"
              open={open && selectedCustomerId === record.customerId}
              onOk={handleOk}
              confirmLoading={confirmLoading}
              onCancel={handleCancel}
              footer={null}
            >
              <AddVoucherForCustomerForm
                onSuccess={handleCancel}
                customerId={record.customerId}
              />
            </Modal>
          </>
        );
      },
    },
  ];

  const handleAddVoucher = async () => {
    setIsModalOpen(true);
    const resp = await axiosClient.get("/orders/customers-by-order-value");
    setCustomer(resp.data);
  };

  const showModal = (customerId: number) => {
    setSelectedCustomerId(customerId);
    setOpen(true);
  };

  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <Button onClick={handleAddVoucher}>Thêm voucher cho khách hàng</Button>
      <Modal
        title="Thêm voucher cho khách hàng"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        centered
        width={1200}
        footer={null}
      >
        <Table
          columns={customerColumns}
          dataSource={customer}
          pagination={false}
        />
      </Modal>
      <SubjectTemplate
        subject="customer"
        subjects="customers"
        currentform={<CustomerForm />}
        defaultColumns={defaultColumns}
      />
    </>
  );
};
export default Customerant;
