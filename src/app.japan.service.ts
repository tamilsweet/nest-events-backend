import { Inject, Injectable } from "@nestjs/common/decorators";

@Injectable()
export class AppJapanService {

  constructor(
    @Inject('APP_NAME') private readonly appName: string,
    @Inject('MESSAGE') private readonly message: string
  ) { }

  getHello(): string {
    return `こんにちは世界! - ${this.appName} - ${this.message}`;
  }
}