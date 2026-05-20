import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';

export type ReferenceUsage = {
  resource: string;
  count: number;
};

export function toReferenceObjectId(
  id: string,
  resourceName = 'reference',
): Types.ObjectId {
  if (!Types.ObjectId.isValid(id)) {
    throw new BadRequestException(`Некоректний id довідника: ${resourceName}`);
  }

  return new Types.ObjectId(id);
}

export function throwReferenceNotFound(
  resourceName: string,
  id: string,
): never {
  throw new NotFoundException(`${resourceName} with ID ${id} not found`);
}

export function throwReferenceInUse(
  resourceName: string,
  usages: ReferenceUsage[],
): void {
  const activeUsages = usages.filter((usage) => usage.count > 0);

  if (activeUsages.length === 0) {
    return;
  }

  throw new ConflictException({
    message: `Неможливо видалити ${resourceName}: об'єкт використовується`,
    usages: activeUsages,
  });
}
