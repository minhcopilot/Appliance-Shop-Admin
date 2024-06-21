import React from "react";
import { Button, Form, Input, InputNumber, Radio, Select, Upload } from "antd";
import type { ColumnsType } from "antd/es/table";
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
        label="Loại bài viết"
        rules={[
          {
            type: "enum",
            enum: ["post", "page"],
            message: "Loại bài viết không hợp lệ",
          },
        ]}
      >
        <Radio.Group
          optionType="button"
          options={[
            { value: "post", label: "Bài viết" },
            { value: "page", label: "Trang" },
          ]}
        />
      </Form.Item>
      <Form.Item
        name="title"
        label="Tiêu đề bài viết"
        validateDebounce={1000}
        rules={[
          { type: "string" },
          { required: true, message: "Tiêu đề là bắt buộc" },
          { max: 100, message: "Tiêu đề quá dài" },
          {
            validator: async (_, title) => {
              return currentId
                ? checkUnique("posts", { title }, currentId)
                : checkUnique("posts", { title });
            },
            message: "Tiêu đề đã được sử dụng",
          },
        ]}
      >
        <Input name="title" type="text"></Input>
      </Form.Item>
      <Form.Item
        name="url"
        label="URL"
        validateDebounce={500}
        rules={[
          { type: "string" },
          { max: 500, message: "URL quá dài" },
          {
            validator: async (_, url) => {
              return currentId
                ? checkUnique("posts", { url }, currentId)
                : checkUnique("posts", { url });
            },
            message: "URL đã được sử dụng",
          },
        ]}
      >
        <Input name="url" type="text"></Input>
      </Form.Item>
      <Form.Item
        name="postCategoryId"
        label="Danh mục bài viết"
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
        label="Trạng thái"
        rules={[
          {
            type: "enum",
            enum: ["draft", "published", "deleted"],
            message: "Trạng thái không hợp lệ",
          },
        ]}
      >
        <Radio.Group
          optionType="button"
          options={[
            { value: "draft", label: "Nháp" },
            { value: "published", label: "Đã đăng" },
            { value: "deleted", label: "Đã xóa" },
          ]}
        />
      </Form.Item>
      <Form.Item
        name="commentStatus"
        label="Trạng thái bình luận"
        rules={[
          {
            type: "enum",
            enum: ["open", "closed"],
            message: "Trạng thái bình luận không hợp lệ",
          },
        ]}
      >
        <Radio.Group
          optionType="button"
          options={[
            { value: "open", label: "Mở" },
            { value: "closed", label: "Đóng" },
          ]}
        />
      </Form.Item>
      <Form.Item
        name="like"
        label="Số lượt thích"
        rules={[
          { type: "number", message: "Số lượt thích không hợp lệ" },
          { type: "integer", message: "Số lượt thích không hợp lệ" },
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
    text: "Bài viết",
    value: "post",
  },
  {
    text: "Trang",
    value: "page",
  },
];
const statusFilter = [
  {
    text: "Nháp",
    value: "draft",
  },
  {
    text: "Đã đăng",
    value: "published",
  },
  {
    text: "Đã xóa",
    value: "deleted",
  },
];
const commentStatusFilter = [
  {
    text: "Mở",
    value: "open",
  },
  {
    text: "Đóng",
    value: "closed",
  },
];
export const postColumns: ColumnsType<PostType> = [
  {
    title: "Loại bài viết",
    dataIndex: "type",
    key: "type",
    filters: typeFilter,
    onFilter: (value, record) => record.type === value,
  },
  {
    title: "Tiêu đề bài viết",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "Danh mục bài viết",
    dataIndex: "category",
    key: "category",
    render: (text: any, record: PostType, index: number) => {
      return <>{record.category?.title}</>;
    },
  },
  {
    title: "Hình ảnh",
    key: "imageUrl",
    dataIndex: "imageUrl",
    width: "1%",
    render: (value: any, record: any, index: number) => {
      return value && <img src={value.url} style={{ height: 60 }} alt="" />;
    },
  },
  {
    title: "Tác giả",
    dataIndex: "authorName",
    key: "authorName",
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    filters: statusFilter,
    onFilter: (value, record) => record.type === value,
    render: (text: any, record: PostType, index: number) => {
      return (
        <>
          {record.status === "draft"
            ? "Nháp"
            : record.status === "published"
            ? "Đã đăng"
            : "Đã xóa"}
        </>
      );
    },
  },
  {
    title: "Trạng thái bình luận",
    dataIndex: "commentStatus",
    key: "commentStatus",
    filters: commentStatusFilter,
    onFilter: (value, record) => record.type === value,
    render: (text: any, record: PostType, index: number) => {
      return <>{record.commentStatus === "open" ? "Mở" : "Đóng"}</>;
    },
  },
  {
    title: "Lượt thích",
    dataIndex: "like",
    key: "like",
  },
  {
    title: "Lượt xem",
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
