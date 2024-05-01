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
        label="First Name"
        rules={[
          { type: "string" },
          { required: true, message: "Customer First Name is required" },
          { max: 100, message: "Customer Name should not be too long" },
        ]}
        initialValue={initialValues && initialValues.firstName}
      >
        <Input name="firstName" type="text"></Input>
      </Form.Item>
      <Form.Item
        name="lastName"
        label="Last Name"
        rules={[
          { type: "string" },
          { required: true, message: "Customer Last Name is required" },
          { max: 100, message: "Customer Name should not be too long" },
        ]}
        initialValue={initialValues && initialValues.lastName}
      >
        <Input name="lastName" type="text"></Input>
      </Form.Item>
      <Form.Item
        name="email"
        label="Email"
        rules={[
          { type: "email", message: "Email is not valid" },
          { required: true, message: "Email is required" },
          { max: 300, message: "Email should not be too long" },
        ]}
        initialValue={initialValues && initialValues.email}
      >
        <Input name="email" type="text"></Input>
      </Form.Item>
      <Form.Item
        name="password"
        label="Password"
        rules={[
          { type: "string", message: "password is not valid" },
          { required: true, message: "password is required" },
          { max: 500, message: "password should not be too long" },
        ]}
        initialValue={initialValues && initialValues.password}
      >
        <Input name="password" type="password"></Input>
      </Form.Item>
      <Form.Item
        name="address"
        label="Address"
        rules={[
          { type: "string" },
          { required: true, message: "Address is required" },
          { max: 300, message: "Address should not be too long" },
        ]}
        initialValue={initialValues && initialValues.address}
      >
        <TextArea name="email" autoSize></TextArea>
      </Form.Item>
      <Form.Item
        name="phoneNumber"
        label="Phone Number"
        rules={[
          { type: "string", message: "Phone Number is not valid" },
          { required: true, message: "Phone Number is required" },
          { max: 12, message: "Phone Number is not valid" },
        ]}
        initialValue={initialValues && initialValues.phoneNumber}
      >
        <Input addonBefore="+84" name="phoneNumber" type="number"></Input>
      </Form.Item>
      <Form.Item
        name="birthday"
        label="Birthday"
        rules={[
          { type: "date", message: "Birthday is not valid" },
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
      title: "Employee Name",
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
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      responsive: ["sm"],
    },
    {
      title: "Address",
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
      title: "Birthday",
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
