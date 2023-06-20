import React from "react";

import { ItemBase } from "@/shared/types";
import { insertItem } from "@/api/helpers";
import { TableName } from "@/api/types";
import IFormInputs from "./formInputs";
import { classNames } from "@/shared/helpers";

export interface IAddItem<T extends ItemBase> {
  tableName: TableName;
  FormInputs: (props: IFormInputs<T>) => React.ReactNode;
}

function AddItem<T extends ItemBase>({ tableName, FormInputs }: IAddItem<T>) {
  const [itemData, setItemData] = React.useState<T>();
  const [submitting, setSubmitting] = React.useState(false);
  const [canSubmit, setCanSubmit] = React.useState(false);

  const onSubmit = () => {
    setSubmitting(true);
    if (itemData) {
      insertItem({
        tableName,
        data: itemData!,
      })
        .then((resp) => {
          if (resp.result === "success") {
            setItemData(undefined);
          }
        })
        .catch(() => {
          // TODO: error notification that submission failed
        })
        .finally(() => {
          setSubmitting(false);
        });
    }
  };

  return (
    <div className="flex flex-col">
      <div className={classNames("mx-auto pt-4 space-y-5", submitting ? "pointer-events-none opacity-50" : "")}>
        {FormInputs({
          itemData,
          setItemData,
          setCanSubmit,
        })}
      </div>
      <button
        type="submit"
        className={classNames(
          "mt-12 bg-blue-600 text-white rounded-lg px-4 py-2 mx-auto",
          !canSubmit || submitting ? "opacity-50" : " hover:opacity-80"
        )}
        disabled={!canSubmit || submitting}
        onClick={onSubmit}
      >
        SUBMIT
      </button>
      {submitting && (
        <div className="flex mx-auto pt-4">
          <div className="spinner"></div>
          <p className="font-bold my-auto pl-3">Adding...</p>
        </div>
      )}
    </div>
  );
}

export default AddItem;