import { IsDateString, IsString, Length } from "class-validator";

export class CreateEventDto {
  @IsString()
  @Length(3, 100, { message: 'Name must be at least 3 characters long' })
  name: string;
  @Length(5, 255)
  description: string;
  @IsDateString()
  when: string;
  @Length(5, 255, { groups: ['create'] })
  @Length(10, 255, { groups: ['update'] })
  address: string;
}