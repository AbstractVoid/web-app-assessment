import React from "react";

import { IUseItems } from "@/shared/hooks";
import { ItemBase } from "@/shared/types";
import { IItemSummary } from "./ItemSummary";
import NoItems from "./NoItems";

function RenderItems<T extends ItemBase>(
  { fetching, error, items, setItems }: IUseItems<T>,
  columnNames: string[],
  itemRenderer: (props: IItemSummary<T>) => React.ReactNode
) {
  return error || (items.length === 0 && !fetching) ? (
    <NoItems error={error} />
  ) : (
    <table className="mx-auto max-w-3xl">
      <tbody className="border-1 border-slate-500">
        <tr>
          {columnNames.map((name, i) => {
              return <th key={i}>{name}</th>
          })}
        </tr>
        {(items.length > 0 ? items : Array(5).fill(0)).map((item, i) => {
          return (
            <React.Fragment key={i}>
              <tr>
                {itemRenderer({
                  loading: fetching,
                  item,
                  onDelete: () => {
                    const newItems = [...items];
                    newItems.splice(i, 1);
                    setItems(newItems);
                  },
                })}
              </tr>
            </React.Fragment>
          );
        })}
      </tbody>
    </table>
  );
}

export default RenderItems;
