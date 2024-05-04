import React from "react";
import { Button, Form, Input, InputNumber, Radio, Select, Upload } from "antd";
import type { ColumnsType } from "antd/es/table";
import TextArea from "antd/es/input/TextArea";
import SubjectTemplate from "../Components/SubjectTemplate";
import useGetSubjects, { useGetSubject } from "../hooks/useGet";
import { UploadOutlined } from "@ant-design/icons";
import { checkUnique } from "../hooks/usefulHooks";
import { Editor } from "@tinymce/tinymce-react";
import { useCurrentId } from "../hooks/usePatch";
import { categorySchemaInput } from "../Category";
// type Props = {};

interface addschemaInput {
  type?: string;
  postCategoryId?: string;
  category?: categorySchemaInput;
  title: string;
  content: string;
  authorId: number;
  authorName: string;
  url: string;
  imageUrl?: string;
  status?: string;
  commentStatus?: string;
}

const PostForm = ({
  form,
  onFinish,
  initialValues,
}: {
  form?: any;
  onFinish?: (data: any) => void;
  initialValues?: addschemaInput;
}) => {
  const postCategory = useGetSubjects("categories");
  const currentId = useCurrentId((state) => state.currentId);
  const getPost = useGetSubject("posts/all", currentId, true);
  return (
    <Form
      form={form}
      onFinish={onFinish}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 8 }}
      initialValues={initialValues}
    >
      <Form.Item
        name="type"
        label="Type"
        rules={[
          {
            type: "enum",
            enum: ["post", "page"],
            message: "Post type is not valid",
          },
        ]}
      >
        <Radio.Group
          optionType="button"
          options={[
            { value: "post", label: "Post" },
            { value: "page", label: "Page" },
          ]}
        />
      </Form.Item>
      <Form.Item
        name="title"
        label="Post Title"
        validateDebounce={1000}
        rules={[
          { type: "string" },
          { required: true, message: "Category Name is required" },
          { max: 100, message: "Category Name should not be too long" },
          {
            validator: async (_, title) => {
              return currentId
                ? checkUnique("posts", { title }, currentId)
                : checkUnique("posts", { title });
            },
            message: "Post Title is already used",
          },
        ]}
      >
        <Input name="title" type="text"></Input>
      </Form.Item>
      <Form.Item
        name="url"
        label="Post URL"
        validateDebounce={500}
        rules={[
          { type: "string" },
          { max: 500, message: "Category Name should not be too long" },
          {
            validator: async (_, url) => {
              return currentId
                ? checkUnique("posts", { url }, currentId)
                : checkUnique("posts", { url });
            },
            message: "URL is already used",
          },
        ]}
      >
        <Input name="url" type="text"></Input>
      </Form.Item>
      <Form.Item
        name="postCategoryId"
        label="Category"
        rules={[{ type: "string" }]}
      >
        <Select
          options={postCategory.data?.map((item) => {
            return { value: item.id, label: item.title };
          })}
        ></Select>
      </Form.Item>
      <Form.Item
        name="status"
        label="Status"
        rules={[
          {
            type: "enum",
            enum: ["draft", "published", "deleted"],
            message: "Post status is not valid",
          },
        ]}
      >
        <Radio.Group
          optionType="button"
          options={[
            { value: "draft", label: "Draft" },
            { value: "published", label: "Published" },
            { value: "deleted", label: "Deleted" },
          ]}
        />
      </Form.Item>
      <Form.Item
        name="commentStatus"
        label="Comment Status"
        rules={[
          {
            type: "enum",
            enum: ["open", "closed"],
            message: "Comment status is not valid",
          },
        ]}
      >
        <Radio.Group
          optionType="button"
          options={[
            { value: "open", label: "Open" },
            { value: "closed", label: "Closed" },
          ]}
        />
      </Form.Item>
      <Form.Item
        name="like"
        label="Like Number"
        rules={[
          { type: "number", message: "Like Number is not valid" },
          { type: "integer", message: "Like Number is not valid" },
        ]}
      >
        <InputNumber name="like" min={0} step={1}></InputNumber>
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
      <Editor
        apiKey="nqe3za5mam2xz4kgv9jw4e5ivd2kidl65xaipm6w8tnemkga"
        init={{
          height: 500,
          menubar: false,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "code",
            "help",
            "wordcount",
          ],
          toolbar:
            "undo redo | blocks | " +
            "bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | help",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        }}
        initialValue={getPost.data?.content}
        onEditorChange={(content) => form.setFieldsValue({ content })}
      />
      <Form.Item name="content" rules={[{ type: "string" }]} />
    </Form>
  );
};

interface PostType extends addschemaInput {
  key: React.Key;
  id: number;
}

const Post = () => {
  const typeFilter = [
    {
      text: "Post",
      value: "post",
    },
    {
      text: "Page",
      value: "page",
    },
  ];
  const statusFilter = [
    {
      text: "Draft",
      value: "draft",
    },
    {
      text: "Published",
      value: "published",
    },
    {
      text: "Deleted",
      value: "deleted",
    },
  ];
  const commentStatusFilter = [
    {
      text: "Open",
      value: "open",
    },
    {
      text: "Closed",
      value: "closed",
    },
  ];
  const defaultColumns: ColumnsType<PostType> = [
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      filters: typeFilter,
      onFilter: (value, record) => record.type === value,
    },
    {
      title: "Post Name",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (text: any, record: PostType, index: number) => {
        return <>{record.category?.title}</>;
      },
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
      title: "Author",
      dataIndex: "authorName",
      key: "authorName",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: statusFilter,
      onFilter: (value, record) => record.type === value,
    },
    {
      title: "Comment Status",
      dataIndex: "commentStatus",
      key: "commentStatus",
      filters: commentStatusFilter,
      onFilter: (value, record) => record.type === value,
    },
    {
      title: "Like",
      dataIndex: "like",
      key: "like",
    },
  ];
  return (
    <SubjectTemplate
      subject="post"
      subjects="posts/all"
      defaultColumns={defaultColumns}
      currentform={<PostForm />}
    />
  );
};
export default Post;
