import React from "react";

import { useItems } from "@/shared/hooks";
import { Course, ItemBase, Result, Student } from "@/shared/types";
import { TableName } from "@/api/types";
import { IItemSummary, ResultItemRenderer } from "./ItemSummary";
import RenderItems from "./RenderItems";
import { queryItems } from "@/api/helpers";

interface IItemsSummary<T extends ItemBase> {
  tableName: TableName;
  itemRenderer: (props: IItemSummary<T>) => React.ReactNode;
}

export function ItemSummaries<T extends ItemBase>({ tableName, itemRenderer }: IItemsSummary<T>) {
  const props = useItems<T>({ tableName });
  return RenderItems<T>(props, itemRenderer);
}

export function ResultItemSummaries() {
  const props = useItems<Result>({ tableName: "results" });
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [students, setStudents] = React.useState<Student[]>([]);

  React.useEffect(() => {
    if (props.items.length > 0 && props.items[0].course_name === undefined) {

      queryItems<Student>({
        tableName: "students",
        fields: ["id", "first_name", "last_name"],
        filterColsEqual: { id: props.items.map(item => item.student_id) }
      }).then(resp => {
        if (resp.result === 'success') {
          setStudents(resp.data);
        }
      })
      
      queryItems<Course>({
        tableName: "courses",
        filterColsEqual: { id: props.items.map(item => item.course_id) }
      }).then(resp => {
        if (resp.result === 'success') {
          setCourses(resp.data);
        }
      })
    }
  }, [props.items]);

  React.useEffect(() => {
    if (students.length > 0 && courses.length > 0) {
      const newItems = props.items.map(item => {
        const student = students.find(student => student.id === item.student_id);
        const course = courses.find(course => course.id === item.course_id);
        return {
          ...item,
          student_name: `${student?.first_name} ${student?.family_name}`,
          course_name: course?.course_name
        }
      });
      props.setItems(newItems);
    }
  }, [students, courses]);

  return RenderItems(props, ResultItemRenderer);
}