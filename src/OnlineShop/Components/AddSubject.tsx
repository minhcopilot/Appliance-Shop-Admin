import { Button, Flex, Form, Space } from "antd";
import Title from "antd/es/typography/Title";
import React from "react";
import useAdd from "../hooks/useAdd";
import axiosClient from "../config/axiosClient";

type Props = {
  subject: string;
  title?: string;
  currentform: React.ReactElement;
};

export default function AddSubject({ subject, currentform, title }: Props) {
  const [addSubject] = Form.useForm();
  // const [data, setData] = React.useState(null);
  const query = useAdd(subject);
  const submitAddSubject = async (data: any) => {
    if (subject === "products") {
      const { files } = data;
      if (files && files.fileList && Array.isArray(files.fileList)) {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("categoryId", data.categoryId);
        formData.append("supplierId", data.supplierId);
        formData.append("price", data.price);
        formData.append("discount", data.discount);
        formData.append("stock", data.stock);
        formData.append("description", data.description);

        files.fileList.forEach((file: any) => {
          formData.append("files", file.originFileObj);
        });
        const dataF: any = formData;
        query.mutate(dataF);
        query.isSuccess && addSubject.resetFields();
      } else {
        console.warn("fileList is not an array or does not exist");
      }
    } else {
      query.mutate(data);
    }
  };
  React.useEffect(() => {
    query.isSuccess && addSubject.resetFields(); // eslint-disable-next-line
  }, [query]);
  return (
    <Flex vertical>
      <Title level={3}>{title}</Title>
      {React.cloneElement(currentform, {
        form: addSubject,
        onFinish: submitAddSubject,
      })}

      <Form.Item wrapperCol={{ sm: { offset: 6 } }}>
        <Space>
          <Button type="primary" onClick={() => addSubject.submit()}>
            Thêm
          </Button>
          <Button onClick={() => addSubject.resetFields()}>Làm mới</Button>
        </Space>
      </Form.Item>
    </Flex>
  );
}
