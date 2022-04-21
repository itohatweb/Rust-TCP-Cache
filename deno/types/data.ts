type DataBase<T extends DataTypes, D> = { t: T; d: D };

export type DataTypes = "Identify" | "Hello" | "GetStats" | "Stats";

export type Data =
  | DataBase<"Identify", { user: string }>
  | DataBase<"Hello", undefined>
  | DataBase<"GetStats", undefined>
  | DataBase<"Stats", { memory_usage: number }>;
