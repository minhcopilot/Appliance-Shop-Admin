import { Alert, Button, Col, Form, Modal, Row, Space, Spin } from "antd";
import React from "react";
import usePatchSubject, {
  useCurrentId,
  usePatchPopup,
} from "../hooks/usePatch";
import useGetSubjects from "../hooks/useGet";
import axiosClient from "../config/axiosClient";

type Props = {
  subject: string;
  title?: string;
  currentform: React.ReactElement;
};

export default function PatchSubject({ subject, currentform, title }: Props) {
  const setPatchPopup = usePatchPopup((state) => state.setPatchPopup);
  const patchPopup = usePatchPopup((state) => state.patchPopup);
  const [patchSubject] = Form.useForm();
  const currentId = useCurrentId((state) => state.currentId);
  const setCurrentId = useCurrentId((state) => state.setCurrentId);
  const query = usePatchSubject(subject);
  const getSubjects = useGetSubjects(subject);
  const submitPatchSubject = async (data: any) => {
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
    const patchData: any = { data: data, id: currentId };
    query.mutate(patchData);
    query.isSuccess && patchSubject.resetFields();
  };
  const currentValues =
    getSubjects.isSuccess &&
    currentId &&
    getSubjects.data?.find((subject: any) => {
      return subject.id === currentId;
    });
  const initialValues = currentValues.imageUrl
    ? {
        ...currentValues,
        imageUrl: {
          name: currentValues.imageUrl.name,
          status: "done",
          url: currentValues.imageUrl.url,
        },
      }
    : currentValues;

  return (
    <Modal
      title={title}
      open={patchPopup}
      onCancel={() => {
        setPatchPopup(false);
        patchSubject.resetFields();
        setCurrentId(null);
      }}
      width={window.innerWidth <= 426 ? "90vw" : "70vw"}
      footer=<Row>
        <Col span={6} />
        <Col>
          <Space>
            <Button type="primary" onClick={() => patchSubject.submit()}>
              Change this {subject}
            </Button>
            <Button
              onClick={() => {
                setPatchPopup(false);
                patchSubject.resetFields();
                setCurrentId(null);
              }}
            >
              Cancel
            </Button>
          </Space>
        </Col>
      </Row>
    >
      {getSubjects.isSuccess ? (
        React.cloneElement(currentform, {
          form: patchSubject,
          onFinish: submitPatchSubject,
          initialValues: initialValues,
        })
      ) : (
        <Spin />
      )}

      {query.isLoading && <Alert message="Submitting" type="info" />}
      {query.isError &&
        (query.error.response ? (
          <Alert
            message={query.error.response.data.message}
            type="error"
            showIcon
            closable
          />
        ) : (
          <Alert message="Lost Connection" type="error" showIcon />
        ))}
    </Modal>
  );
}
