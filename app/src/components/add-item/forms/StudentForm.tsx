import React from "react";

import IFormRenderer from "../formRenderer";
import { Student } from "@/shared/types";
import FormTextInput from "../FormTextInput";
import { isValidPastDate } from "@/shared/helpers";

function StudentForm({
  itemData,
  updateData,
  setCanSubmit,
}: IFormRenderer<Student>) {
  const [validEmail, setValidEmail] = React.useState(false);
  const [validDob, setValidDob] = React.useState(false);

  const validFirstName = Boolean(itemData?.first_name);
  const validFamilyName = Boolean(itemData?.family_name);

  const updateDob = (value: string) => {
    if (value.length > 10) {
      value = value.slice(0, 10);
    }

    setValidDob(isValidPastDate(value));
    updateData("dob", value);
  };

  const updateEmail = (value: string) => {
    const emailRegex = /^[^\s]+@[^\s]+\.[^\s]+$/;
    setValidEmail(Boolean(value.match(emailRegex)));
    updateData("email", value);
  };

  React.useEffect(() => {
    setCanSubmit(validFirstName && validFamilyName && validDob && validEmail);
  }, [itemData]);

  return (
    <div className="space-y-5">
      <FormTextInput
        title="First Name"
        value={itemData?.first_name}
        onChange={(val) => updateData("first_name", val)}
      />
      <FormTextInput
        title="Last Name"
        value={itemData?.family_name}
        onChange={(val) => updateData("family_name", val)}
      />
      <FormTextInput
        title="Date of Birth"
        value={itemData?.dob}
        placeholder="MM/DD/YYYY"
        onChange={(val) => updateDob(val)}
        errorMessage={!validDob && itemData?.dob ? "Invalid Date of birth" : ""}
        errorDescription={!validDob && itemData?.dob ? "Should be MM/DD/YYYY and be a date in the past" : ""}
      />
      <FormTextInput
        title="Email"
        placeholder="example@gmail.com"
        value={itemData?.email}
        onChange={(val) => updateEmail(val)}
        errorMessage={!validEmail && itemData?.email ? "Invalid email" : ""}
      />
    </div>
  );
}

export default StudentForm;
