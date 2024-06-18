import React from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Form, Input } from "antd";
import type { ColumnsType } from "antd/es/table";
import SubjectTemplate from "../Components/SubjectTemplate";
dayjs.extend(customParseFormat);
dayjs.extend(utc);

interface addschemaInput {
  roleCode: string;
  value: string;
}

const RoleForm = ({
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
      initialValues={
        initialValues && {
          ...initialValues,
        }
      }
    >
      <Form.Item
        name="roleCode"
        label="Mã quyền"
        rules={[{ required: true, message: "Mã quyền không được bỏ trống" }]}
      >
        <Input name="roleCode" type="roleCode"></Input>
      </Form.Item>
      <Form.Item
        name="value"
        label="Tên quyền"
        rules={[{ required: true, message: "Tên quyền is required" }]}
      >
        <Input name="value" type="text"></Input>
      </Form.Item>
    </Form>
  );
};
interface RoleType extends addschemaInput {
  key: React.Key;
  id: number;
}

const RoleAnt = () => {
  const defaultColumns: ColumnsType<RoleType> = [
    {
      title: "Mã quyền",
      dataIndex: "roleCode",
      key: "roleCode",
    },
    {
      title: "Tên quyền",
      dataIndex: "value",
      key: "value",
      responsive: ["lg"],
    },
  ];
  return (
    <SubjectTemplate
      subject="role"
      subjects="admin/roles"
      currentform={<RoleForm />}
      defaultColumns={defaultColumns}
    />
  );
};
export default RoleAnt;
