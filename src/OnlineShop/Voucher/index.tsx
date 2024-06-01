import React from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { DatePicker, Form, Input } from "antd";
import type { ColumnsType } from "antd/es/table";
import TextArea from "antd/es/input/TextArea";
import SubjectTemplate from "../Components/SubjectTemplate";
dayjs.extend(customParseFormat);
dayjs.extend(utc);
const dateFormat = "YYYY-MM-DD";

interface addschemaInput {
  voucherCode: string;
  discountPercentage: number;
  startDate: string;
  expiryDate: string;
  maxUsageCount: number;
  remainingUsageCount: number;
}

const VoucherForm = ({
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
          startDate:
            initialValues.startDate && dayjs(initialValues.startDate).local(),
          expiryDate:
            initialValues.expiryDate && dayjs(initialValues.expiryDate).local(),
        }
      }
    >
      <Form.Item
        name="voucherCode"
        label="Mã giảm giá"
        rules={[
          { type: "string" },
          { required: true, message: "Tên mã giảm giá không được bỏ trống" },
          { max: 100, message: "Tên mã giảm giá không được quá dài" },
        ]}
      >
        <Input name="name" type="text"></Input>
      </Form.Item>
      <Form.Item
        name="discountPercentage"
        label="% giảm giá"
        rules={[
          // { type: "number", message: "discountPercentage không hợp lệ" },
          { required: true, message: "discountPercentage không được bỏ trống" },
        ]}
      >
        <Input name="discountPercentage" type="number"></Input>
      </Form.Item>
      <Form.Item
        name="startDate"
        label="Ngày hiệu lực"
        rules={[
          { type: "date", message: "startDate không hợp lệ" },
          { required: true, message: "startDate is required" },
        ]}
      >
        <DatePicker format={"YYYY-MM-DD"} name="startDate" />
      </Form.Item>
      <Form.Item
        name="expiryDate"
        label="Hạn sử dụng"
        rules={[
          { type: "date", message: "expiryDate không hợp lệ" },
          { required: true, message: "expiryDate is required" },
        ]}
        initialValue={
          initialValues && initialValues.expiryDate
            ? dayjs(initialValues.expiryDate, "YYYY-MM-DD")
            : undefined
        }
      >
        <DatePicker format={"YYYY-MM-DD"} name="expiryDate" />
      </Form.Item>
      <Form.Item
        name="maxUsageCount"
        label="Số lần sử dụng"
        rules={[
          // { type: "string", message: "Số lần sử dụng không hợp lệ" },
          { required: true, message: "Số lần sử dụng không được bỏ trống" },
        ]}
      >
        <Input name="maxUsageCount" type="number"></Input>
      </Form.Item>
    </Form>
  );
};
interface VoucherType extends addschemaInput {
  key: React.Key;
  id: number;
}

const Voucherant = () => {
  const defaultColumns: ColumnsType<VoucherType> = [
    {
      title: "Tên mã giảm giá",
      dataIndex: "voucherCode",
      key: "voucherCode",
    },
    {
      title: "% giảm giá",
      dataIndex: "discountPercentage",
      key: "discountPercentage",
      responsive: ["lg"],
    },
    {
      title: "Ngày sử dụng",
      dataIndex: "startDate",
      key: "startDate",
      render: (text: any, record: VoucherType, index: number) => {
        return (
          <>{record.startDate && dayjs(record.startDate).format(dateFormat)}</>
        );
      },
      responsive: ["xl"],
    },
    {
      title: "Hạn sử dụng",
      dataIndex: "expiryDate",
      key: "expiryDate",
      render: (text: any, record: VoucherType, index: number) => {
        return (
          <>
            {record.expiryDate && dayjs(record.expiryDate).format(dateFormat)}
          </>
        );
      },
      responsive: ["xl"],
    },
    {
      title: "Số lần sử dụng",
      dataIndex: "maxUsageCount",
      key: "maxUsageCount",
      responsive: ["md"],
    },
    {
      title: "Số lần sử dụng còn lại",
      dataIndex: "remainingUsageCount",
      key: "remainingUsageCount",
      responsive: ["md"],
    },
  ];
  return (
    <SubjectTemplate
      subject="voucher"
      subjects="vouchers"
      currentform={<VoucherForm />}
      defaultColumns={defaultColumns}
    />
  );
};
export default Voucherant;
