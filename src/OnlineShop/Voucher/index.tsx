import React from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { DatePicker, Flex, Form, Input, InputNumber, Select } from "antd";
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
          { type: "number", message: "% giảm giá không hợp lệ" },
          { required: true, message: "% giảm giá không được bỏ trống" },
        ]}
      >
        <InputNumber
          name="discountPercentage"
          type="number"
          min={0}
          max={100}
        ></InputNumber>
      </Form.Item>
      <Form.Item
        name="startDate"
        label="Ngày hiệu lực"
        rules={[
          { type: "date", message: "Ngày hiệu lực không hợp lệ" },
          { required: true, message: "Ngày hiệu lực is required" },
        ]}
      >
        <DatePicker format={"YYYY-MM-DD"} name="startDate" />
      </Form.Item>
      <Form.Item
        name="expiryDate"
        label="Hạn sử dụng"
        rules={[
          { type: "date", message: "Hạn sử dụng không hợp lệ" },
          { required: true, message: "Hạn sử dụng is required" },
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
          { type: "number", message: "Số lần sử dụng không hợp lệ" },
          { required: true, message: "Số lần sử dụng không được bỏ trống" },
        ]}
      >
        <InputNumber type="number" min={0}></InputNumber>
      </Form.Item>
      <Form.Item
        name="voucherType"
        label="Loại voucher"
        rules={[
          { required: true, message: "Loại voucher không được bỏ trống" },
        ]}
      >
        <Select
          options={[
            { label: "Voucher toàn sàn", value: "GLOBAL" },
            { label: "Voucher cho khách hàng", value: "CUSTOMER" },
          ]}
        />
      </Form.Item>
    </Form>
  );
};

const VoucherSearchForm = ({
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
          name="voucherCode"
          label="Mã giảm giá"
          rules={[
            { type: "string" },
            { max: 100, message: "Tên mã giảm giá không được quá dài" },
          ]}
          style={{ flex: 1, minWidth: 220 }}
        >
          <Input name="name" type="text"></Input>
        </Form.Item>
        <Form.Item label="% giảm giá" style={{ flex: 1, minWidth: 220 }}>
          <Flex gap={5}>
            <Form.Item name="discountPercentageFrom">
              <InputNumber addonAfter="%" min={0} max={100}></InputNumber>
            </Form.Item>
            {" - "}
            <Form.Item name="discountPercentageTo">
              <InputNumber addonAfter="%" min={0} max={100}></InputNumber>
            </Form.Item>
          </Flex>
        </Form.Item>
        <Form.Item label="Số lần sử dụng" style={{ flex: 1, minWidth: 300 }}>
          <Flex gap={5} style={{ width: "100%" }} wrap="wrap">
            <Form.Item
              name="maxUsageCountFrom"
              style={{ flex: 1, minWidth: 50 }}
            >
              <InputNumber min={0} style={{ width: "100%" }}></InputNumber>
            </Form.Item>
            {" - "}
            <Form.Item name="maxUsageCountTo" style={{ flex: 1, minWidth: 50 }}>
              <InputNumber min={0} style={{ width: "100%" }}></InputNumber>
            </Form.Item>
          </Flex>
        </Form.Item>
      </Flex>
      <Flex wrap="wrap" gap={10}>
        <Form.Item
          name="startDate"
          label="Ngày hiệu lực"
          style={{ flex: 1, minWidth: 220 }}
        >
          <DatePicker.RangePicker
            format={"YYYY-MM-DD"}
            name="startDate"
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item
          name="expiryDate"
          label="Hạn sử dụng"
          style={{ flex: 1, minWidth: 220 }}
        >
          <DatePicker.RangePicker
            format={"YYYY-MM-DD"}
            name="expiryDate"
            style={{ width: "100%" }}
          />
        </Form.Item>
        {buttons}
      </Flex>
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
    {
      title: "Loại voucher",
      dataIndex: "voucherType",
      key: "voucherType",
      responsive: ["md"],
    },
  ];
  return (
    <SubjectTemplate
      subject="voucher"
      subjects="vouchers"
      currentform={<VoucherForm />}
      defaultColumns={defaultColumns}
      searchform={<VoucherSearchForm />}
    />
  );
};
export default Voucherant;
