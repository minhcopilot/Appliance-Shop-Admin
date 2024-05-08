import { Alert, Button, Col, Form, Modal, Row, Space, Spin } from "antd";
import React from "react";
import usePatchSubject, {
  useCurrentId,
  usePatchPopup,
} from "../hooks/usePatch";
import useGetSubjects from "../hooks/useGet";

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
  let initialFileList = getSubjects.data;
  const submitPatchSubject = (data: any) => {
    const passdata: any = { data: data, id: currentId };
    query.mutate(passdata);
  };
  if (subject === "products") {
    initialFileList = getSubjects.data
      ?.find((subject: any) => subject.id === currentId)
      ?.imageUrls.map((image: any, index: number) => ({
        uid: `${currentId}_${index}`, // Sử dụng uid duy nhất gồm id và index
        name: image.name,
        status: "done",
        url: image.url,
      }));
  }
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
      footer={
        <Row>
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
      }
    >
      {getSubjects.isSuccess ? (
        React.cloneElement(currentform, {
          form: patchSubject,
          onFinish: submitPatchSubject,
          initialValues: {
            ...getSubjects.data?.find((subject: any) => {
              return subject.id === currentId;
            }),
          },
          fileList1: initialFileList,
        })
      ) : (
        <Spin />
      )}
      {query.isLoading && <Alert message="Đang xử lí" type="info" />}
      {query.isError &&
        (query.error.response ? (
          <Alert
            message={query.error.response.data.message}
            type="error"
            showIcon
            closable
          />
        ) : (
          <Alert message="Mất kết nối" type="error" showIcon />
        ))}
    </Modal>
  );
}
