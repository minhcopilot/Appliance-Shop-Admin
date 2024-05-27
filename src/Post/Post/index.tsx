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
import { useParams } from "react-router-dom";
import axiosClient from "../config/axiosClient";
import useAuth from "../../OnlineShop/hooks/useAuth";
import { resolve } from "path";
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
  imageUrl?: any;
  status?: string;
  commentStatus?: string;
}

export const PostForm = ({
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
  const access_token = useAuth((state) => state.token);
  const tinymceUpload = (blobInfo: any, progress: any) =>
    new Promise<string>(async (resolve, reject) => {
      // Create a FormData object to send the file to the server
      const formData = new FormData();
      formData.append("file", blobInfo.blob(), blobInfo.filename());
      currentId && formData.append("postId", currentId);

      const result = await axiosClient.post("/posts/all/upload", formData, {
        onUploadProgress: (progressEvent) => {
          progress && progress(progress);
        },
        headers: {
          Authorization: "Bearer " + access_token,
        },
      });
      if (result.status === 403) {
        reject({ message: "HTTP Error: " + result.status, remove: true });
        return;
      }

      if (result.status < 200 || result.status >= 300) {
        reject("HTTP Error: " + result.status);
        return;
      }
      return resolve(result.data.url);
    });

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
      <Form.Item name="file" label="Hình ảnh">
        <Upload
          listType="picture"
          maxCount={1}
          defaultFileList={
            initialValues?.imageUrl ? [initialValues.imageUrl] : []
          }
          beforeUpload={() => false}
        >
          <Button icon={<UploadOutlined />}>Chọn hình ảnh</Button>
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
            "removeformat | help" +
            "link | image",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
          images_upload_handler: tinymceUpload,
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
export const postColumns: ColumnsType<PostType> = [
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
    render: (value: any, record: any, index: number) => {
      return value && <img src={value.url} style={{ height: 60 }} alt="" />;
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
  {
    title: "View",
    dataIndex: "view",
    key: "view",
  },
];

const Post = () => {
  let params = useParams();
  console.log(params);
  return (
    <SubjectTemplate
      subject="post"
      subjects={
        params.postCategoryId
          ? "posts/all/search/query?postCategoryId=" + params.postCategoryId
          : "posts/all"
      }
      defaultColumns={postColumns}
      currentform={<PostForm />}
    />
  );
};
export default Post;
