import { z } from "zod";

// we need to do this because Neo4j has terrible TypeScript :( no one is perfect?
const neo4jSingleArrayRecordSchema = z.array(
  z.object({ _fields: z.array(z.array(z.unknown())).length(1) })
);

const neo4jObjectRecordSchema = z.array(
  z.object({
    _fields: z.array(z.unknown()),
    _fieldLookup: z.record(z.number()),
  })
);

export const extractResultsArrayFromNeo4jRecords = <ItemType>(
  records: any,
  schema: z.Schema<ItemType>
): ItemType[] => {
  const typedRecords = neo4jSingleArrayRecordSchema.safeParse(records);
  if (!typedRecords.success) return [];
  const results = typedRecords.data;
  return results[0]._fields[0].filter((result) => {
    const validation = schema.safeParse(result);
    return validation.success;
  }) as ItemType[];
};

export const extractResultsObjectFromNeo4jRecords = <ItemType>(
  records: any,
  schema: z.Schema<ItemType>
): ItemType => {
  const typedRecords = neo4jObjectRecordSchema.safeParse(records);
  if (!typedRecords.success) {
    throw new Error("Error in validating data");
  }
  const result: Record<string, unknown> = {};
  const [{ _fields: values, _fieldLookup: keysToValueIndex }] =
    typedRecords.data;
  Object.entries(keysToValueIndex).forEach(([key, index]) => {
    if (values[index]) result[key] = values[index];
  });
  const validatedResult = schema.safeParse(result);
  if (validatedResult.success) {
    return validatedResult.data;
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
