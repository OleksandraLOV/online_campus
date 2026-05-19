import { Types } from 'mongoose';

type ObjectWithPossibleId = {
  _id?: unknown;
  id?: unknown;
};

export const toId = (value: unknown): string => {
  if (value instanceof Types.ObjectId) return value.toHexString();
  if (typeof value === 'string') return value;
  if (
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    typeof value === 'bigint'
  ) {
    return value.toString();
  }
  if (typeof value === 'object' && value !== null) {
    const record = value as ObjectWithPossibleId;
    if (record._id !== undefined) return toId(record._id);
    if (record.id !== undefined) return toId(record.id);
  }
  return String(value);
};
