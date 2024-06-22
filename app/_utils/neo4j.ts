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

export const extractFirstErrorMessageFromSchemaError = (
  schemaErrorMessage: z.ZodError<any>["message"]
): string => {
  try {
    const parsedErrorAray = JSON.parse(schemaErrorMessage);
    if (
      Array.isArray(parsedErrorAray) &&
      parsedErrorAray.length &&
      typeof parsedErrorAray[0]["message"] == "string"
    )
      return parsedErrorAray[0]["message"] as string;
    else throw new Error("zod error are not an array");
  } catch (err) {
    throw new Error("invalid");
  }
};

export const isBackup = (
  searchParams?: Record<string, unknown> | ReadonlyURLSearchParams
) =>
  !!(
    searchParams &&
    "backup" in searchParams &&
    searchParams["backup"] === "backup"
  );
