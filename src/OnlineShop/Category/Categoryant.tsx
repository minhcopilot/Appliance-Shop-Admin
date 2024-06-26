import React from "react";
import { Button, Flex, Form, Input } from "antd";
import type { ColumnsType } from "antd/es/table";
import TextArea from "antd/es/input/TextArea";
// import useTableColumn from "../hooks/useTableColumns";
import SubjectTemplate from "../Components/SubjectTemplate";
// type Props = {};

interface addschemaInput {
  name: string;
  description?: string;
}

const CategoryForm = ({
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
        label="Tên danh mục"
        rules={[
          { type: "string" },
          { required: true, message: "Tên danh mục là bắt buộc" },
          { max: 50, message: "Tên danh mục quá dài" },
        ]}
      >
        <Input name="name" type="text"></Input>
      </Form.Item>
      <Form.Item
        name="description"
        label="Mô tả"
        rules={[{ type: "string" }, { max: 500, message: "Mô tả quá dài" }]}
      >
        <TextArea name="description" autoSize></TextArea>
      </Form.Item>
    </Form>
  );
};

const CategorySearchForm = ({
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
          label="Tên danh mục"
          rules={[
            { type: "string" },
            { max: 50, message: "Tên danh mục quá dài" },
          ]}
          style={{ flex: 1, minWidth: 220 }}
        >
          <Input name="name" type="text"></Input>
        </Form.Item>
        <Form.Item
          name="description"
          label="Mô tả"
          rules={[{ type: "string" }, { max: 500, message: "Mô tả quá dài" }]}
          style={{ flex: 1, minWidth: 220 }}
        >
          <TextArea name="description" autoSize></TextArea>
        </Form.Item>
        {buttons}
      </Flex>
    </Form>
  );
};

interface CategoryType extends addschemaInput {
  key: React.Key;
  id: number;
}

const Categoryant = () => {
  const defaultColumns: ColumnsType<CategoryType> = [
    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      responsive: ["sm"],
    },
  ];
  // const [categoryColumn] = useTableColumn("categories", defaultColumns);
  return (
    <SubjectTemplate
      subject="category"
      subjects="categories"
      defaultColumns={defaultColumns}
      currentform={<CategoryForm />}
      searchform={<CategorySearchForm />}
    />
  );
};
export default Categoryant;
