import React from "react";

import { ItemBase, Course, Result, Student } from "@/shared/types";
import { queryItems, deleteItem } from "@/api/helpers";
import { TableName } from "@/api/types";

export interface IItemSummary<T extends ItemBase> {
  loading: boolean;
  onDelete: () => void;
  item: T;
}

interface IItemSummaryBase {
  tableName: TableName;
  itemId?: number;
  loading: boolean;
  canDelete?: boolean;
  onDelete: () => void;
  children?: React.ReactNode;
}

const ItemSummaryBase: React.FC<IItemSummaryBase> = ({
  tableName,
  itemId,
  loading,
  canDelete,
  onDelete,
  children,
}) => {
  const [deleting, setDeleting] = React.useState(false);

  const onClickDelete = () => {
    setDeleting(true);

    deleteItem({
      tableName,
      itemId: itemId!,
    })
      .then((data) => {
        if (data.result === "success") {
          onDelete();
        }
      })
      .catch((error) => {
        // TODO: notification that delete failed?
      })
      .finally(() => {
        setDeleting(false);
      });
  };

  return loading || deleting ? (
    <>
      <td>LOADING</td>
    </>
  ) : (
    <>
      {children}
      {canDelete && (
        <td className="flex space-x-4">
          <button onClick={onClickDelete}>DELETE</button>
        </td>
      )}
    </>
  );
};

export const StudentItemRenderer: React.FC<IItemSummary<Student>> = ({
  loading,
  item,
  onDelete,
}) => {
  return (
    <ItemSummaryBase tableName="students" itemId={item?.id} loading={loading} onDelete={onDelete}>
      {item && (
        <>
          <td>{item.first_name}</td>
          <td>{item.family_name}</td>
          <td>{item.dob}</td>
          <td>{item.email}</td>
        </>
      )}
    </ItemSummaryBase>
  );
};

export const CourseItemRenderer: React.FC<IItemSummary<Course>> = ({
  loading,
  item,
  onDelete,
}) => {
  return (
    <ItemSummaryBase tableName="courses" itemId={item?.id} loading={loading} onDelete={onDelete}>
      {item && (
        <>
          <td>{item.course_name}</td>
        </>
      )}
    </ItemSummaryBase>
  );
};

export const ResultItemRenderer: React.FC<IItemSummary<Result>> = ({
  loading,
  item,
  onDelete,
}) => {
  return (
    <ItemSummaryBase tableName="results" itemId={item?.id} loading={loading || !item.course_name} onDelete={onDelete}>
      {item && (
        <>
          <td>{item.score}</td>
        </>
      )}
    </ItemSummaryBase>
  );
};
