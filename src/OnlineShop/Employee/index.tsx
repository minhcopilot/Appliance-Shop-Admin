import React from "react";
// import styles from "./Employee.module.css";
import { DatePicker, Form, Input } from "antd";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import customParseFormat from "dayjs/plugin/customParseFormat";
import type { ColumnsType } from "antd/es/table";
import TextArea from "antd/es/input/TextArea";
import SubjectTemplate from "../Components/SubjectTemplate";
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

const EmployeeForm = ({
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
          { required: true, message: "Họ và tên đệm của nhân viên không được bỏ trống" },
          { max: 100, message: "Họ và tên đệm của nhân viên quá dài" },
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
          { required: true, message: "Tên của nhân viên không được bỏ trống" },
          { max: 100, message: "Tên của nhân viên không được quá dài" },
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
          { required: true, message: "Địa chỉ không được bỏ trống" },
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
          { required: true, message: "Số điện thoại không được bỏ trống" },
          { max: 12, message: "Số điện thoại không hợp lệ" },
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
interface EmployeeType extends addschemaInput {
  key: React.Key;
  id: number;
}

const Employeeant = () => {
  const defaultColumns: ColumnsType<EmployeeType> = [
    {
      title: "Tên nhân viên",
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
      responsive: ["md"],
      render: (value, record, index) => {
        return record.address
          ? `${record.address.slice(0, 50)}${
              record.address.length > 50 ? "..." : ""
            } `
          : null;
      },
    },
    {
      title: "Ngày sinh",
      dataIndex: "birthday",
      key: "birthday",
      render: (text: any, record: EmployeeType, index: number) => {
        return (
          <>{record.birthday && dayjs(record.birthday).format(dateFormat)}</>
        );
      },
      responsive: ["xl"],
    },
  ];
  return (
    <SubjectTemplate
      subject="employee"
      subjects="employees"
      currentform={<EmployeeForm />}
      defaultColumns={defaultColumns}
    />
  );
};
export default Employeeant;
