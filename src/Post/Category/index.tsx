import React from "react";
import { Button, Form, Input, Select, Upload } from "antd";
import type { ColumnsType } from "antd/es/table";
import TextArea from "antd/es/input/TextArea";
import SubjectTemplate from "../Components/SubjectTemplate";
import useGetSubjects from "../hooks/useGet";
import { UploadOutlined } from "@ant-design/icons";
import { checkUnique } from "../hooks/usefulHooks";
import { useCurrentId } from "../hooks/usePatch";
// type Props = {};

export interface categorySchemaInput {
  title: string;
  description?: string;
  parentId?: string;
  url?: string;
  isDeleted?: boolean;
  parentCategory?: categorySchemaInput;
}

const CategoryForm = ({
  form,
  onFinish,
  initialValues,
}: {
  form?: any;
  onFinish?: (data: any) => void;
  initialValues?: categorySchemaInput;
}) => {
  const postCategory = useGetSubjects("categories");
  const currentId = useCurrentId((state) => state.currentId);
  const normFile = (e: any) => {
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  return (
    <Form
      form={form}
      onFinish={onFinish}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 8 }}
      initialValues={initialValues}
    >
      <Form.Item
        name="title"
        label="Category Name"
        validateDebounce={1000}
        rules={[
          { type: "string" },
          { required: true, message: "Category Name is required" },
          { max: 50, message: "Category Name should not be too long" },
          {
            validator: async (_, title) => {
              return currentId
                ? checkUnique("categories", { title }, currentId)
                : checkUnique("categories", { title });
            },
            message: "Category Name is already used",
          },
        ]}
      >
        <Input name="title" type="text"></Input>
      </Form.Item>
      <Form.Item name="file" label="Image">
        <Upload
          name="file"
          listType="picture"
          beforeUpload={(f: any) => {
            form.setFieldsValue({ file: f });
            return false;
          }}
        >
          <Button icon={<UploadOutlined />}>Click to upload</Button>
        </Upload>
      </Form.Item>
      <Form.Item
        name="url"
        label="Category URL"
        rules={[
          { type: "string" },
          { max: 500, message: "Category URL should not be too long" },
          {
            validator: async (_, url) => {
              return currentId
                ? checkUnique("categories", { url }, currentId)
                : checkUnique("categories", { url });
            },
            message: "Category URL is already used",
          },
        ]}
      >
        <Input name="url" type="text"></Input>
      </Form.Item>
      <Form.Item
        name="parentId"
        label="Category Parent"
        rules={[{ type: "string" }]}
      >
        <Select
          options={postCategory.data?.map((item) => {
            return { value: item.id, label: item.title };
          })}
        ></Select>
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

interface CategoryType extends categorySchemaInput {
  key: React.Key;
  id: number;
}

const ArticleCategory = () => {
  const defaultColumns: ColumnsType<CategoryType> = [
    {
      title: "Category Name",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Image",
      key: "imageUrl",
      dataIndex: "imageUrl",
      width: "1%",
      render: (value: string, record: any, index: number) => {
        return (
          <img
            src={"http://localhost:9000" + value}
            style={{ height: 60 }}
            alt=""
          />
        );
      },
    },
    {
      title: "Parent Category Name",
      dataIndex: "parentId",
      key: "parentId",
      render: (text: any, record: CategoryType, index: number) => {
        return <>{record.parentCategory?.title}</>;
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      responsive: ["sm"],
      render: (value, record, index) => {
        return record.description
          ? `${record.description.slice(0, 100)}${
              record.description.length > 100 ? "..." : ""
            } `
          : null;
      },
    },
  ];
  return (
    <SubjectTemplate
      subject="category"
      subjects="categories"
      defaultColumns={defaultColumns}
      currentform={<CategoryForm />}
    />
  );
};
export default ArticleCategory;
