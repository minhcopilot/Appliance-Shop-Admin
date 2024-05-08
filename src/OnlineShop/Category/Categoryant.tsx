import React from "react";
import { Form, Input } from "antd";
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
        label="Category Name"
        rules={[
          { type: "string" },
          { required: true, message: "Category Name is required" },
          { max: 50, message: "Category Name should not be too long" },
        ]}
      >
        <Input name="name" type="text"></Input>
      </Form.Item>
      <Form.Item
        name="description"
        label="Description"
        rules={[
          { type: "string" },
          { max: 500, message: "Description should not be too long" },
        ]}
      >
        <TextArea name="description" autoSize></TextArea>
      </Form.Item>
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
      title: "Category Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
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
    />
  );
};
export default Categoryant;
