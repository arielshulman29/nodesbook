import { ReadonlyURLSearchParams } from "next/navigation";
import { z } from "zod";

const neo4jObjectRecordSchema = z.array(
  z.object({
    _fields: z.array(z.unknown()),
    _fieldLookup: z.record(z.number()),
  })
);

export const extractResultsObjectFromNeo4jRecordsbyKey = <ItemType>(
  records: any,
  recordsKeyToValidate: string,
  schema: z.Schema<ItemType>
): z.SafeParseReturnType<ItemType, ItemType> => {
  const typedRecords = neo4jObjectRecordSchema.safeParse(records);
  if (!typedRecords.success) {
    throw new Error("Error in validating data");
  }
  const result: Record<string, unknown> = {};
  const { _fields: values, _fieldLookup: keysToValueIndex } =
    typedRecords.data[0];
  Object.entries(keysToValueIndex).forEach(([key, index]) => {
    if (values[index]) result[key] = values[index];
  });
  return schema.safeParse(result[recordsKeyToValidate]);
};

export const isBackup = (
  searchParams?: Record<string, unknown> | ReadonlyURLSearchParams
) => {
  if (searchParams instanceof ReadonlyURLSearchParams) {
    return (
      searchParams.has("backup") && searchParams.get("backup") === "backup"
    );
  }
  return !!(
    searchParams &&
    "backup" in searchParams &&
    searchParams["backup"] === "backup"
  );
};
