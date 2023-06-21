import React from "react";

import IFormRenderer from "../formInputs";
import { Student, StudentCol } from "@/shared/types";
import FormTextInput from "../FormTextInput";
import { parseDate, yearsSinceCurrTime } from "@/shared/helpers";

function StudentFormInputs({
  itemData,
  setItemData,
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

    const dateOfBirth = parseDate(value);
    if (dateOfBirth !== undefined) {
      setValidDob(yearsSinceCurrTime(dateOfBirth) >= 10);
    } else {
      setValidDob(false);
    }
    setItemData({ ...itemData, [StudentCol.DateOfBirth]: value });
  };

  const updateEmail = (value: string) => {
    const emailRegex = /^[^\s]+@[^\s]+\.[^\s]+$/;
    setValidEmail(Boolean(value.match(emailRegex)));
    setItemData({ ...itemData, [StudentCol.Email]: value });
  };

  React.useEffect(() => {
    setCanSubmit(validFirstName && validFamilyName && validDob && validEmail);
  }, [itemData]);

  return (
    <>
      <FormTextInput
        title="First Name"
        value={itemData?.first_name}
        onChange={(val) => setItemData({ ...itemData, [StudentCol.FirstName]: val })}
      />
      <FormTextInput
        title="Last Name"
        value={itemData?.family_name}
        onChange={(val) => setItemData({ ...itemData, [StudentCol.FamilyName]: val})}
      />
      <FormTextInput
        title="Date of Birth"
        value={itemData?.dob}
        placeholder="MM/DD/YYYY"
        onChange={(val) => updateDob(val)}
        errorMessage={!validDob && itemData?.dob ? "Invalid Date of birth" : ""}
        errorDescription={
          !validDob && itemData?.dob
            ? "Should be MM/DD/YYYY and student should be at least 10 years old."
            : ""
        }
      />
      <FormTextInput
        title="Email"
        placeholder="example@gmail.com"
        value={itemData?.email}
        onChange={(val) => updateEmail(val)}
        errorMessage={!validEmail && itemData?.email ? "Invalid email" : ""}
      />
    </>
  );
}

export default StudentFormInputs;
