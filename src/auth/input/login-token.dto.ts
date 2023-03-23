import { Expose } from "class-transformer";

export class LoginTokenDto {

  constructor(partial: Partial<LoginTokenDto>) {
    Object.assign(this, partial);
  }

  @Expose()
  id: number;

  @Expose()
  token: string;
}