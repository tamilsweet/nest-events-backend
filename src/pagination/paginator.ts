// Pagination module

import { Expose } from "class-transformer";
import { SelectQueryBuilder } from "typeorm";

export class PaginateOptions {
  limit: number;
  currentPage: number;
  total?: boolean;
}

export class PaginationResult<T> {
  constructor(partial: Partial<PaginationResult<T>>) {
    Object.assign(this, partial);
  }

  @Expose()
  first: number;
  @Expose()
  last: number;
  @Expose()
  total?: number;
  @Expose()
  limit: number;
  @Expose()
  data: T[];
}

export async function paginate<T>(
  qb: SelectQueryBuilder<T>,
  options: PaginateOptions = {
    limit: 10,
    currentPage: 1,
  }
): Promise<PaginationResult<T>> {
  const offset = (options.currentPage - 1) * options.limit;
  const [data, total] = await qb
    .take(options.limit)
    .skip(offset)
    .getManyAndCount();

  return new PaginationResult({
    first: offset + 1,
    last: offset + data.length,
    total,
    // total: options.total ? await qb.getCount() : null,
    limit: options.limit,
    data,
  });

}