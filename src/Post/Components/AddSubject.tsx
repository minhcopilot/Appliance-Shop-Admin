import { Button, Collapse, Flex, Form, Space } from "antd";
import Title from "antd/es/typography/Title";
import React from "react";
import useAdd from "../hooks/useAdd";
import { ArrowLeftOutlined } from "@ant-design/icons";

type Props = {
  subject: string;
  title?: string;
  currentform: React.ReactElement;
};

export default function AddSubject({ subject, currentform, title }: Props) {
  const [addSubject] = Form.useForm();
  // const [data, setData] = React.useState(null);
  const query = useAdd(subject);
  const submitAddSubject = (data: any) => {
    if (data.file) {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (data[key] == undefined) {
          return;
        }
        if (key === "file") {
          formData.append(key, data[key].fileList[0].originFileObj);
        } else {
          formData.append(key, data[key]);
        }
      });
      data = formData;
    }
    query.mutate(data);
    query.isSuccess && addSubject.resetFields();
  };
  React.useEffect(() => {
    query.isSuccess && addSubject.resetFields(); // eslint-disable-next-line
  }, [query]);
  return (
    <Flex vertical>
      <Collapse
        size="large"
        items={[
          {
            key: "add",
            label: <p style={{ fontWeight: "bold" }}>{title}</p>,
            children: (
              <>
                {React.cloneElement(currentform, {
                  form: addSubject,
                  onFinish: submitAddSubject,
                })}

                <Form.Item wrapperCol={{ sm: { offset: 6 } }}>
                  <Space>
                    <Button type="primary" onClick={() => addSubject.submit()}>
                      Add
                    </Button>
                    <Button onClick={() => addSubject.resetFields()}>
                      Reset
                    </Button>
                  </Space>
                </Form.Item>
              </>
            ),
          },
        ]}
      />
    </Flex>
  );
}
