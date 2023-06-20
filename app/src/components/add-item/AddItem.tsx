import React from "react";

import { ItemBase } from "@/shared/types";
import { insertItem } from "@/api/helpers";
import { TableName } from "@/api/types";
import IFormRenderer from "./formRenderer";
import { classNames } from "@/shared/helpers";

export interface IAddItem<T extends ItemBase> {
  tableName: TableName;
  FormRenderer: (props: IFormRenderer<T>) => React.ReactNode;
}

function AddItem<T extends ItemBase>({ tableName, FormRenderer }: IAddItem<T>) {
  const [itemData, setItemData] = React.useState<T>();
  const [submitting, setSubmitting] = React.useState(false);
  const [canSubmit, setCanSubmit] = React.useState(false);

  const updateData = (attr: string, val: any) => {
    const newData: any = { ...itemData };
    newData[attr] = val;
    setItemData(newData);
  };

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
      <div className={classNames("mx-auto pt-4", submitting ? "pointer-events-none opacity-50" : "")}>
        {FormRenderer({
          itemData,
          updateData,
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