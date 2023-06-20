import React from "react";

import { ItemBase, Course, Result, Student } from "@/shared/types";
import { deleteItem } from "@/api/helpers";
import { TableName } from "@/api/types";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { getFullName } from "@/shared/helpers";
import { toast } from 'react-toastify'

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
  const onClickDelete = () => {
    onDelete();
    deleteItem({
      tableName,
      itemId: itemId!,
    });
    toast("Successfully deleted item");
  };

  return loading ? (
    <>
      {Array(columns)
        .fill(0)
        .map((_, i) => {
          return (
            <td key={i} className="opacity-10">
              Loading...
            </td>
          );
        })}
    </>
  ) : (
    <>
      {children}
      {canDelete && (
        <td className="flex space-x-4">
          <button onClick={onClickDelete} className="outline-0 group">
            <XMarkIcon className="text-red-500 text-4xl w-7 h-7 my-auto transition group-hover:scale-[120%]" />
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
    <ItemSummaryBase
      tableName="students"
      columns={4}
      itemId={item?.id}
      loading={loading}
      onDelete={onDelete}
    >
      {item && (
        <>
          <td>{getFullName(item)}</td>
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
    <ItemSummaryBase
      tableName="courses"
      columns={2}
      itemId={item?.id}
      loading={loading}
      onDelete={onDelete}
    >
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
    <ItemSummaryBase
      tableName="results"
      columns={3}
      itemId={item?.id}
      loading={loading || !item.course_name}
      onDelete={onDelete}
      canDelete={false}
    >
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
