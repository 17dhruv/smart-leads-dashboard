const escapeCsvValue = (value: string | number | Date | null | undefined): string => {
  const normalized = value instanceof Date ? value.toISOString() : String(value ?? "");
  return `"${normalized.replaceAll('"', '""')}"`;
};

export const toCsv = <T extends Record<string, string | number | Date | null | undefined>>(
  rows: T[],
  columns: Array<{ key: keyof T; header: string }>
): string => {
  const header = columns.map((column) => escapeCsvValue(column.header)).join(",");
  const body = rows.map((row) =>
    columns.map((column) => escapeCsvValue(row[column.key])).join(",")
  );

  return [header, ...body].join("\n");
};
