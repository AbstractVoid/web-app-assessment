import React from "react";

import { ItemBase, Course, Result, Student } from "@/shared/types";
import { queryItems, deleteItem } from "@/api/helpers";
import { TableName } from "@/api/types";
import { XMarkIcon } from '@heroicons/react/20/solid'

export interface IItemSummary<T extends ItemBase> {
  loading: boolean;
  onDelete: () => void;
  item: T;
}

interface IItemSummaryBase {
  tableName: TableName;
  columns: number;
  itemId?: number;
  loading: boolean;
  canDelete?: boolean;
  onDelete: () => void;
  children?: React.ReactNode;
}

const ItemSummaryBase: React.FC<IItemSummaryBase> = ({
  tableName,
  columns,
  itemId,
  loading,
  canDelete = true,
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
      {Array(columns).fill(0).map((_, i) => {
        return <td key={i}>LOADING</td>
      })}
    </>
  ) : (
    <>
      {children}
      {canDelete && (
        <td className="flex space-x-4">
          <button onClick={onClickDelete} className="border-transparent">
            <XMarkIcon className="text-red-500 text-4xl w-5 h-5" />
          </button>
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
    <ItemSummaryBase tableName="students" columns={4} itemId={item?.id} loading={loading} onDelete={onDelete}>
      {item && (
        <>
          <td>{item.first_name} {item.family_name}</td>
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
    <ItemSummaryBase tableName="courses" columns={2} itemId={item?.id} loading={loading} onDelete={onDelete}>
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
    <ItemSummaryBase tableName="results" columns={3} itemId={item?.id} loading={loading || !item.course_name} onDelete={onDelete} canDelete={false}>
      {item && (
        <>
          <td>{item.course_name}</td>
          <td>{item.student_name}</td>
          <td>{item.score}</td>
        </>
      )}
    </ItemSummaryBase>
  );
};
