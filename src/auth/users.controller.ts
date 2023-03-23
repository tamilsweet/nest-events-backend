// User Controller

import { BadRequestException, Body, ClassSerializerInterceptor, Controller, Logger, Post, SerializeOptions, UseInterceptors } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "./input/create-user.dto";
import { LoginTokenDto } from "./input/login-token.dto";
import { User } from "./user.entity";

@Controller("users")
@SerializeOptions({
  strategy: 'excludeAll'
})
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(
    private readonly authService: AuthService
  ) { }

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  async create(@Body() createUserDto: CreateUserDto) {
    this.logger.log('Creating user...');

    if (createUserDto.password !== createUserDto.retypedPassword) {
      throw new BadRequestException(['Passwords do not match']);
    }

    const userExists = await this.authService.userExists(createUserDto.username, createUserDto.email);
    if (userExists) {
      throw new BadRequestException(['Username or Email is already taken']);
    }

    const user = await this.authService.createUser(new User(createUserDto));

    const response = new LoginTokenDto({
      id: user.id,
      token: await this.authService.getTokenForUser(user)
    });
    return response;
  }
}