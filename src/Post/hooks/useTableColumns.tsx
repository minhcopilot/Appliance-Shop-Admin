import React from "react";
import { Button, Flex } from "antd";
import { ColumnType, ColumnsType } from "antd/es/table";
import { AiOutlineEdit } from "react-icons/ai";
import { useCurrentId, usePatchPopup } from "./usePatch";
import DeleteSubject from "../Components/DeleteSubject";
import useAuth from "../../OnlineShop/hooks/useAuth";

const useTableColumn = (subject: string, column: ColumnsType<any>) => {
  const loggedInUser = useAuth((state) => state.loggedInUser);
  const setCurrentId = useCurrentId((state) => state.setCurrentId);
  const setPatchPopup = usePatchPopup((state) => state.setPatchPopup);
  const actionColumn: ColumnType<any> = {
    title: "",
    dataIndex: "actions",
    key: "actions",
    fixed: "right",
    width: 120,
    render: (value: any, record: any, index: number) => {
      return (
        <Flex gap={5} wrap="wrap-reverse" justify="flex-end">
          <Button
            icon={<AiOutlineEdit />}
            onClick={() => {
              setCurrentId(record.id);
              setPatchPopup(true);
            }}
          />
          <DeleteSubject
            deleteId={[record.id]}
            subject={subject}
            title={"Bạn có chắc chắn muốn xóa?"}
            collapsed
          />
        </Flex>
      );
    },
  };
  const [categoryColumn, setCategoryColumn] =
    React.useState<ColumnsType<any>>(column);
  React.useEffect(() => {
    loggedInUser
      ? setCategoryColumn([...column, actionColumn])
      : setCategoryColumn(column); // eslint-disable-next-line
  }, [loggedInUser]);
  return [categoryColumn];
};
export default useTableColumn;
