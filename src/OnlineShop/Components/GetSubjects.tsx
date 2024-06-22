import Table, { ColumnsType } from "antd/es/table";
import React from "react";
import { Alert, Button, Flex, Form, Space, Spin } from "antd";
import Title from "antd/es/typography/Title";
import useGetSubjects from "../hooks/useGet";
import DeleteSubject from "./DeleteSubject";
import dayjs from "dayjs";

type Props = {
  subject: string;
  title?: string;
  subjectColumn: ColumnsType<any>;
  searchform?: React.ReactElement;
};

export default function GetSubjects({
  subject,
  title,
  subjectColumn,
  searchform,
}: Props) {
  // const refresh = useRefresh((state) => state.refresh);
  const query = useGetSubjects(subject);
  const [filterData, setFilterData] = React.useState<any[]>([]);
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
  const [searchForm] = Form.useForm();
  const handleSearch = (values: any) => {
    if (!query.data || query.data?.length === 0) {
      return;
    }
    console.log(values);
    let filterdData = query.data;
    for (const [key, value] of Object.entries(values)) {
      if (value) {
        // Filter String Case Insensitive
        if (typeof value === "string") {
          filterdData = filterdData.filter((user) => {
            if (user.firstName && key === "name") {
              console.log("filtered name");
              return `${user.lastName} ${user.firstName}`
                .toLowerCase()
                .includes(value.toLowerCase() as string);
            }
            return user[key].toLowerCase().includes(value.toLowerCase());
          });
        } else if (value instanceof Date) {
          // Filter Date
          let date = (value as Date).toISOString();
          filterdData = filterdData.filter((user) => {
            return user[key] === date;
          });
        } else if (
          Array.isArray(value) &&
          value.length === 2 &&
          value.find((v) => v instanceof dayjs)
        ) {
          //Filter Date Range
          let [start, end] = value;
          console.log(start.format());
          filterdData = filterdData.filter((user) => {
            console.log(user[key]);
            return (
              user[key] >= start.toISOString() && user[key] <= end.toISOString()
            );
          });
        } else if (typeof value === "number") {
          //Filter Number Range
          if (key.includes("From")) {
            console.log("Filter Number Range");
            filterdData = filterdData.filter((user) => {
              return user[key.replace("From", "")] >= value;
            });
          } else if (key.includes("To")) {
            console.log("Filter Number Range");
            filterdData = filterdData.filter((user) => {
              return user[key.replace("To", "")] <= value;
            });
          } else {
            console.log("Filter Number");
            filterdData = filterdData.filter((user) => {
              return user[key] === value;
            });
          }
        } else {
          console.log("Filter Normal");
          filterdData = filterdData.filter((user) => {
            return user[key] === value;
          });
        }
      }
    }
    setFilterData(filterdData);
  };
  const buttons = (
    <Flex gap={5} wrap="wrap">
      <Button type="primary" htmlType="submit">
        Tìm kiếm
      </Button>
      <Button
        htmlType="button"
        onClick={() => {
          searchForm.resetFields();
          query.isSuccess && setFilterData(query.data);
        }}
      >
        Xoá
      </Button>
    </Flex>
  );

  React.useEffect(() => {
    query.isSuccess && setFilterData(query.data);
  }, [query.data]);
  return (
    <Flex vertical>
      <Title level={3}>{title}</Title>
      {query.isLoading ? (
        <Spin />
      ) : query.isError ? (
        <Alert message={query.error.message} type="error" closable />
      ) : (
        <Flex vertical gap={10}>
          {searchform &&
            React.cloneElement(searchform, {
              form: searchForm,
              onFinish: handleSearch,
              buttons,
            })}
          <DeleteSubject
            deleteId={selectedRowKeys}
            subject={subject}
            title="Bạn có muốn xoá những mục đã chọn không?"
            disabled={!hasSelected}
            type="primary"
          />
          <Table
            rowKey="id"
            rowSelection={rowSelection}
            columns={subjectColumn}
            dataSource={filterData}
            style={{ overflow: "scroll" }}
          />
        </Flex>
      )}
    </Flex>
  );
}
