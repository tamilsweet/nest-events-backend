import { IsEnum } from "class-validator";
import { AttendeeStatusEnum } from "../attendee.entity";


export class CreateAttendeeDto {
  @IsEnum(AttendeeStatusEnum)
  public answer: AttendeeStatusEnum;
}