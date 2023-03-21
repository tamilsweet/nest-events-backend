import { IsEnum, IsOptional, IsString } from "class-validator";

export enum WhenEventFilterEnum {
  TODAY = 'today',
  TOMORROW = 'tomorrow',
  THIS_WEEK = 'this week',
  NEXT_WEEK = 'next week',
  ALL = 'all'
}

export class ListEvents {
  // @IsOptional()
  @IsEnum(WhenEventFilterEnum)
  when: WhenEventFilterEnum = WhenEventFilterEnum.ALL;

  page: number = 1
  limit: number = 10
  // @IsOptional()
  // @IsString()
  // search?: string;
}