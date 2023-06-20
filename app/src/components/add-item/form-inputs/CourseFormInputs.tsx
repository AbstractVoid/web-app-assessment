import React from "react";

import IFormRenderer from "../formInputs";
import { Course, CourseCol } from "@/shared/types";
import FormTextInput from "../FormTextInput";

function CourseFormInputs({
  itemData,
  setItemData,
  setCanSubmit,
}: IFormRenderer<Course>) {

  React.useEffect(() => {
    setCanSubmit(Boolean(itemData?.course_name));
  }, [itemData]);

  return (
    <>
        <FormTextInput
          title="Course Name"
          value={itemData?.course_name}
          onChange={(val) => setItemData({ ...itemData, [CourseCol.CourseName]: val })}
        />
    </>
  );
}

export default CourseFormInputs;
