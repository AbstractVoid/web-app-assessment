import axios from "axios";

import {
  QueryInput,
  InsertInput,
  DeleteInput,
  QueryResp,
  InsertResp,
  APIRespBase,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY!;
const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  "x-api-key": API_KEY,
};

function getEndpoint(tableName: string, itemId?: number): string {
  return `${API_URL}/${tableName}${
    itemId !== undefined ? "/" + itemId?.toString() : ""
  }`;
}

export async function queryItems<T>(input: QueryInput): Promise<QueryResp<T>> {
  const query = [];
  if (input.fields) {
    query.push(`fields=${input.fields.join(",")}`);
  }

  if (input.filterColsEqual || input.filterColsNotEqual) {
    const filter = [];

    if (input.filterColsEqual) {
        for (let [key, value] of Object.entries(input.filterColsEqual!)) {
          filter.push(`${key}=${value}`);
        }
    }

    if (input.filterColsNotEqual) {
        for (let [key, value] of Object.entries(input.filterColsNotEqual!)) {
          filter.push(`${key}!=${value}`);
        }
    }

    query.push(`filter=${filter.join(",")}`);
  }

  const queryString = query.length > 0 ? "?" + query.join("&") : "";
  const endpoint = `${getEndpoint(input.tableName)}${queryString}`;
  const resp = await axios.request({
    method: "GET",
    url: endpoint,
    headers: DEFAULT_HEADERS,
  });

  return resp.data as QueryResp<T>;
}

export async function insertItem<T>(
  input: InsertInput<T>
): Promise<InsertResp<T>> {
  const resp = await axios.request({
    method: "POST",
    url: getEndpoint(input.tableName),
    data: input.data,
    headers: DEFAULT_HEADERS,
  });

  return resp.data as InsertResp<T>;
}

export async function deleteItem(input: DeleteInput): Promise<APIRespBase> {
  const resp = await axios.request({
    method: "DELETE",
    url: getEndpoint(input.tableName, input.itemId),
    headers: DEFAULT_HEADERS,
  });

  return resp.data as APIRespBase;
}
