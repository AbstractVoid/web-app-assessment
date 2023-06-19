import React from "react";

import { queryItems } from '@/api/helpers'
import { QueryInput } from "@/api/types";

export function useItems<T>(inputData: QueryInput): T[] {
    const [fetching, setFetching] = React.useState(false);
    const [items, setItems] = React.useState<T[]>([]);
  
    React.useEffect(() => {
      if (items.length === 0 && !fetching) {
        setFetching(true);
        queryItems<T>(inputData)
          .then((resp) => {
            console.log(resp.data);
            setItems(resp.data);
          })
          .catch((e) => {
            console.error(e);
          }).finally(() => {
            setFetching(false);
          });
      }
    }, []);

    return items;
}