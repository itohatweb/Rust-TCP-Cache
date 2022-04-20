type DataBase<T extends DataTypes, D> = { t: T; d: D };

export type DataTypes = "Identify" | "Hello";

export type Data =
  | DataBase<"Identify", { user: string }>
  | DataBase<"Hello", undefined>;
