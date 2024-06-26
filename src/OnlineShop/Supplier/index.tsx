import React from "react";
// import styles from "./Supplier.module.css";

import { Flex, Form, Input } from "antd";
import type { ColumnsType } from "antd/es/table";
import TextArea from "antd/es/input/TextArea";
import SubjectTemplate from "../Components/SubjectTemplate";
// type Props = {};

interface addschemaInput {
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
}

const SupplierForm = ({
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
      initialValues={initialValues}
    >
      <Form.Item
        name="name"
        label="Tên nhà cung cấp"
        rules={[
          { type: "string" },
          { required: true, message: "Tên nhà cung cấp không được bỏ trống" },
          { max: 100, message: "Tên nhà cung cấp không được quá dài" },
        ]}
      >
        <Input name="name" type="text"></Input>
      </Form.Item>
      <Form.Item
        name="email"
        label="Email"
        rules={[
          { type: "email", message: "Email không hợp lệ" },
          { required: true, message: "Email không được bỏ trống" },
          { max: 300, message: "Email không được quá dài" },
        ]}
      >
        <Input name="email" type="text"></Input>
      </Form.Item>
      <Form.Item
        name="address"
        label="Địa chỉ"
        rules={[
          { type: "string" },
          { required: true, message: "Địa chỉ không được bỏ trống" },
          { max: 300, message: "Địa chỉ không được quá dài" },
        ]}
      >
        <TextArea name="email" autoSize></TextArea>
      </Form.Item>
      <Form.Item
        name="phoneNumber"
        label="Số điện thoại"
        rules={[
          { type: "string", message: "Số điện thoại không hợp lệ" },
          { required: true, message: "Số điện thoại không được bỏ trống" },
          {
            pattern: /^((\+84|0)[2|3|5|7|8|9])+([0-9]{8})\b/,
            message: "Số điện thoại không hợp lệ",
          },
        ]}
      >
        <Input addonBefore="+84" name="phoneNumber" type="number"></Input>
      </Form.Item>
    </Form>
  );
};

const SupplierSearchForm = ({
  form,
  onFinish,
  buttons,
}: {
  form?: any;
  onFinish?: (data: any) => void;
  buttons?: React.ReactElement;
}) => {
  return (
    <Form form={form} onFinish={onFinish}>
      <Flex wrap="wrap" gap={10}>
        <Form.Item
          name="name"
          label="Tên nhà cung cấp"
          rules={[
            { type: "string" },
            { max: 100, message: "Tên nhà cung cấp không được quá dài" },
          ]}
          style={{ flex: 1, minWidth: 220 }}
        >
          <Input name="name" type="text"></Input>
        </Form.Item>

        <Form.Item
          name="address"
          label="Địa chỉ"
          rules={[
            { type: "string" },
            { max: 300, message: "Địa chỉ không được quá dài" },
          ]}
          style={{ flex: 1, minWidth: 220 }}
        >
          <TextArea name="email" autoSize></TextArea>
        </Form.Item>
        <Form.Item
          name="phoneNumber"
          label="Số điện thoại"
          rules={[{ type: "string", message: "Số điện thoại không hợp lệ" }]}
          style={{ flex: 1, minWidth: 220 }}
        >
          <Input name="phoneNumber" type="number"></Input>
        </Form.Item>
      </Flex>
      <Flex wrap="wrap" gap={10}>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ max: 300, message: "Email không được quá dài" }]}
          style={{ flex: 1, minWidth: 250 }}
        >
          <Input name="email" type="text"></Input>
        </Form.Item>
        {buttons}
      </Flex>
    </Form>
  );
};

interface SupplierType extends addschemaInput {
  key: React.Key;
  id: number;
}

const Supplierant = () => {
  const defaultColumns: ColumnsType<SupplierType> = [
    {
      title: "Tên nhà cung cấp",
      dataIndex: "name",
      key: "name",
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
      responsive: ["md"],
      render: (value, record, index) => {
        return record.address
          ? `${record.address.slice(0, 50)}${
              record.address.length > 50 ? "..." : ""
            } `
          : null;
      },
    },
  ];
  return (
    <SubjectTemplate
      subject="supplier"
      subjects="suppliers"
      currentform={<SupplierForm />}
      defaultColumns={defaultColumns}
      searchform={<SupplierSearchForm />}
    />
  );
};
export default Supplierant;
