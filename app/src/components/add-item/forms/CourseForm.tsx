import React from "react";

import IFormRenderer from "../formRenderer";
import { Course } from "@/shared/types";
import FormTextInput from "../FormTextInput";

function CourseForm({
  itemData,
  updateData,
  setCanSubmit,
}: IFormRenderer<Course>) {

  React.useEffect(() => {
    setCanSubmit(Boolean(itemData?.course_name));
  }, [itemData]);

  return (
    <div className="space-y-5">
      <FormTextInput
        title="Course Name"
        value={itemData?.course_name}
        onChange={(val) => updateData("course_name", val)}
      />
    </div>
  );
}

export default CourseForm;
