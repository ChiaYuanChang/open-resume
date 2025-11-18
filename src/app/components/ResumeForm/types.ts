export type CreateHandleChangeArgsWithDescriptions<T> =
  | [field: Exclude<keyof T, "description">, value: string]
  | [field: "description", value: string];
