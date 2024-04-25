import React from "react";
import { Button, Flex } from "antd";
import { ColumnType, ColumnsType } from "antd/es/table";
import { AiOutlineEdit } from "react-icons/ai";
import { useCurrentId, usePatchPopup } from "./usePatch";
import DeleteSubject from "../Components/DeleteSubject";
import useAuth from "./useAuth";

const useTableColumn = (subject: string, column: ColumnsType<any>) => {
  const loggedInUser = useAuth((state) => state.loggedInUser);
  const setCurrentId = useCurrentId((state) => state.setCurrentId);
  const setPatchPopup = usePatchPopup((state) => state.setPatchPopup);
  const idColumn: ColumnType<any> = {
    title: "ID",
    dataIndex: "id",
    key: "id",
    align: "right",
    defaultSortOrder: "descend",
    sorter: (a, b) => a.id - b.id,
    width: 80,
    responsive: ["md"],
  };
  const actionColumn: ColumnType<any> = {
    title: "",
    dataIndex: "actions",
    key: "actions",
    fixed: "right",
    width: window.innerWidth <= 426 ? 120 : 220,
    render: (value: any, record: any, index: number) => {
      return (
        <Flex gap={5} wrap="wrap-reverse" justify="flex-end">
          <Button
            icon={<AiOutlineEdit />}
            onClick={() => {
              setCurrentId(record.id);
              setPatchPopup(true);
            }}
          >
            Edit
          </Button>
          <DeleteSubject
            deleteId={[record.id]}
            subject={subject}
            title={"Are you sure to delete this?"}
          />
        </Flex>
      );
    },
  };
  const [categoryColumn, setCategoryColumn] =
    React.useState<ColumnsType<any>>(column);
  React.useEffect(() => {
    loggedInUser
      ? setCategoryColumn([idColumn, ...column, actionColumn])
      : setCategoryColumn(column); // eslint-disable-next-line
  }, [loggedInUser]);
  return [categoryColumn];
};
export default useTableColumn;
