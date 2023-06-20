import React from "react";

import { queryItems } from "@/api/helpers";
import { QueryInput } from "@/api/types";

export interface IUseItems<T> {
  fetching: boolean;
  error: string | undefined;
  items: T[];
  setItems: (newItems: T[]) => void;
}

export function useItems<T>(inputData: QueryInput): IUseItems<T> {
  const [fetching, setFetching] = React.useState(true);
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [items, setItems] = React.useState<T[]>([]);

  React.useEffect(() => {
    queryItems<T>(inputData)
      .then((resp) => {
        setItems(resp.data);
      })
      .catch((e) => {
        console.error(e);
        setError(e);
      })
      .finally(() => {
        console.log("done");
        setFetching(false);
      });
  }, []);

  return {
    fetching,
    error,
    items,
    setItems,
  };
}
