import React from "react";
import { useCurrentId } from "../hooks/usePatch";
import { ColumnsType } from "antd/es/table";
import useTableColumn from "../hooks/useTableColumns";
import { Flex } from "antd";
import AddSubject from "./AddSubject";
import GetSubjects from "./GetSubjects";
import PatchSubject from "./PatchSubject";
import useAuth from "../../OnlineShop/hooks/useAuth";

type Props = {
  subjects: string;
  subject: string;
  defaultColumns: ColumnsType<any>;
  currentform: React.ReactElement;
};

export default function SubjectTemplate({
  subjects,
  subject,
  defaultColumns,
  currentform,
}: Props) {
  const loggedInUser = useAuth((state) => state.loggedInUser);
  const currentId = useCurrentId((state) => state.currentId);
  const [subjectColumn] = useTableColumn(subjects, defaultColumns);

  return (
    <Flex vertical gap={15}>
      {loggedInUser && (
        <AddSubject
          currentform={currentform}
          subject={subjects}
          title={"Add " + subject}
        />
      )}
      <GetSubjects
        subject={subjects}
        subjectColumn={subjectColumn}
        title={"All " + subjects}
      />
      {loggedInUser && (
        <>
          {currentId && (
            <PatchSubject
              currentform={currentform}
              subject={subjects}
              title={"Patch " + subject}
            />
          )}
        </>
      )}
    </Flex>
  );
}
