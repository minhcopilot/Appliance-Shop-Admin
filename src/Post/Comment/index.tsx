import React from "react";
import { Flex, Form, Input, Radio, Select } from "antd";
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

export const CommentSearchForm = ({
  form,
  onFinish,
  buttons,
}: {
  form?: any;
  onFinish?: (data: any) => void;
  buttons?: React.ReactElement;
}) => {
  const postList = useGetSubjects("posts/all");
  return (
    <>
      {postList.isSuccess && (
        <Form form={form} onFinish={onFinish}>
          <Flex wrap="wrap" gap={10}>
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
              style={{ flex: 1, minWidth: 220 }}
            >
              <Select
                allowClear
                options={[
                  { value: "approved", label: "Đã duyệt" },
                  { value: "pending", label: "Đang chờ" },
                  { value: "spam", label: "Spam" },
                ]}
              />
            </Form.Item>
            <Form.Item
              name="postId"
              label="Bài viết"
              rules={[{ type: "string" }]}
              style={{ flex: 1, minWidth: 220 }}
            >
              <Select
                allowClear
                options={postList.data?.map((item) => {
                  console.log(item);
                  return { value: item.id, label: item.title };
                })}
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              />
            </Form.Item>
          </Flex>
          <Flex wrap="wrap" gap={10}>
            <Form.Item
              name="author"
              label="Tác giả"
              rules={[
                { type: "string" },
                { max: 100, message: "Tên tác giả không được quá dài" },
              ]}
              style={{ flex: 1, minWidth: 220 }}
            >
              <Input name="author" type="text"></Input>
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ max: 100, message: "Email không được quá dài" }]}
              style={{ flex: 1, minWidth: 220 }}
            >
              <Input name="email" type="text"></Input>
            </Form.Item>
            <Form.Item
              name="content"
              label="Nội dung"
              rules={[{ type: "string" }]}
              style={{ flex: 1, minWidth: 220 }}
            >
              <Input type="text" />
            </Form.Item>
            {buttons}
          </Flex>
        </Form>
      )}
    </>
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

export const limitWord = (str: string, limit: number) => {
  const words = str.split(" ");
  if (words.length > limit) {
    return words.slice(0, limit).join(" ") + "...";
  } else {
    return str;
  }
};

export const commentColumns: ColumnsType<CommentType> = [
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    filters: statusFilter,
    onFilter: (value, record) => record.status === value,
    render: (text: any, record: CommentType, index: number) => {
      if (record.status === "approved") {
        return <span style={{ color: "green" }}>Đã duyệt</span>;
      } else if (record.status === "pending") {
        return <span style={{ color: "blue" }}>Đang chờ</span>;
      } else {
        return <span style={{ color: "red" }}>Spam</span>;
      }
    },
  },
  {
    title: "Bài viết",
    key: "postId",
    render: (record) => {
      return limitWord(record.post.title, 10);
    },
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
        searchform={<CommentSearchForm />}
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
