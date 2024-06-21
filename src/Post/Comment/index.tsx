import React from "react";
import { Form, Input, Radio } from "antd";
import type { ColumnsType } from "antd/es/table";
import SubjectTemplate from "../Components/SubjectTemplate";
import useGetSubjects, { useGetSubject } from "../hooks/useGet";
import { useCurrentId } from "../hooks/usePatch";
import { useParams } from "react-router-dom";
import GetSubjects from "../Components/GetSubjects";
import useAuth from "../../OnlineShop/hooks/useAuth";
import PatchSubject from "../Components/PatchSubject";
import useTableColumn from "../hooks/useTableColumns";
// type Props = {};

interface addschemaInput {
  author: string;
  email: string;
  content: string;
  status: string;
}

export const CommentForm = ({
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
  return (
    <Form
      form={form}
      onFinish={onFinish}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 8 }}
      initialValues={initialValues}
    >
      <Form.Item
        name="status"
        label="Trạng thái"
        rules={[
          {
            type: "enum",
            enum: ["approved", "pending", "spam"],
            message: "Trạng thái không hợp lệ",
          },
        ]}
      >
        <Radio.Group
          optionType="button"
          options={[
            { value: "approved", label: "Đã duyệt" },
            { value: "pending", label: "Đang chờ" },
            { value: "spam", label: "Spam" },
          ]}
        />
      </Form.Item>
      <Form.Item
        name="author"
        label="Tác giả"
        validateDebounce={1000}
        rules={[
          { type: "string" },
          { required: true, message: "Tên tác giả là bắt buộc" },
          { max: 100, message: "Tên tác giả không được quá dài" },
        ]}
      >
        <Input name="author" type="text"></Input>
      </Form.Item>
      <Form.Item
        name="email"
        label="Email"
        validateDebounce={500}
        rules={[
          { type: "email" },
          { max: 100, message: "Email không được quá dài" },
        ]}
      >
        <Input name="email" type="text"></Input>
      </Form.Item>
      <Form.Item name="content" label="Nội dung" rules={[{ type: "string" }]}>
        <Input.TextArea name="content" autoSize rows={3} />
      </Form.Item>
    </Form>
  );
};

interface CommentType extends addschemaInput {
  key: React.Key;
  id: number;
}

const statusFilter = [
  {
    text: "Đã duyệt",
    value: "approved",
  },
  {
    text: "Đang chờ",
    value: "pending",
  },
  {
    text: "Spam",
    value: "spam",
  },
];

export const commentColumns: ColumnsType<CommentType> = [
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    filters: statusFilter,
    onFilter: (value, record) => record.status === value,
  },
  {
    title: "Tác giả",
    dataIndex: "author",
    key: "author",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Nội dung",
    dataIndex: "content",
    key: "content",
  },
];

const Comment = () => {
  let params = useParams();
  const loggedInUser = useAuth((state) => state.loggedInUser);
  const currentId = useCurrentId((state) => state.currentId);
  let subjects = params.postId
    ? "comments/all/search/query?postId=" + params.postId
    : "comments/all";
  const [subjectColumn] = useTableColumn(subjects, commentColumns);
  return (
    <>
      <GetSubjects
        subject={subjects}
        subjectColumn={subjectColumn}
        title="Danh sách bình luận"
      />
      {loggedInUser && (
        <>
          {currentId && (
            <PatchSubject
              currentform={<CommentForm />}
              subject={subjects}
              title="Chỉnh sửa bình luận"
            />
          )}
        </>
      )}
    </>
  );
};
export default Comment;
