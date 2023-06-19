export type ResultStatus = "success" | "error" | "not_found";
export type TableName = "students" | "courses" | "results";

export interface APIRespBase {
  result: ResultStatus;
}

export interface QueryResp<T> extends APIRespBase {
  data: T[];
}

export interface InsertResp<T> extends APIRespBase {
  data: T;
}

export interface APIInputBase {
  tableName: TableName;
}

export interface QueryInput extends APIInputBase {
  fields?: string[];
  filterColsEqual?: { [key: string]: string };
  filterColsNotEqual?: { [key: string]: string };
}

export interface InsertInput<T> extends APIInputBase {
  data: Partial<T>;
}

export interface DeleteInput extends APIInputBase {
  itemId: number;
}
