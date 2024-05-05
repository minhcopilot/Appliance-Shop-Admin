import Table, { ColumnsType } from "antd/es/table";
import React from "react";
import { Alert, Flex, Space, Spin } from "antd";
import Title from "antd/es/typography/Title";
import useGetSubjects from "../hooks/useGet";
import DeleteSubject from "./DeleteSubject";

type Props = {
  subject: string;
  title?: string;
  subjectColumn: ColumnsType<any>;
};

export default function GetSubjects({ subject, title, subjectColumn }: Props) {
  // const refresh = useRefresh((state) => state.refresh);
  const query = useGetSubjects(subject);
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<any[]>([]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    fixed: true,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_NONE,
      Table.SELECTION_INVERT,
    ],
  };
  const hasSelected = selectedRowKeys.length > 0;
  return (
    <Flex vertical>
      {query.isLoading ? (
        <Spin />
      ) : query.isError ? (
        <Alert message={query.error.message} type="error" closable />
      ) : (
        <Space direction="vertical">
          <DeleteSubject
            deleteId={selectedRowKeys}
            subject={subject}
            title="Delete Selected Items?"
            disabled={!hasSelected}
            type="primary"
          />
          <Table
            rowKey="id"
            rowSelection={rowSelection}
            columns={subjectColumn}
            dataSource={query.data}
            style={{ overflow: "scroll" }}
          />
        </Space>
      )}
    </Flex>
  );
}
