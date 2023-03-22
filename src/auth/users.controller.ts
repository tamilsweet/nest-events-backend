// User Controller

import { BadRequestException, Body, ClassSerializerInterceptor, Controller, Logger, Post, SerializeOptions, UseInterceptors } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "./input/create-user.dto";
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
    const user = new User();

    if (createUserDto.password !== createUserDto.retypedPassword) {
      throw new BadRequestException(['Passwords do not match']);
    }

    const userExists = await this.authService.userExists(createUserDto.username, createUserDto.email);
    if (userExists) {
      throw new BadRequestException(['Username or Email is already taken']);
    }

    user.username = createUserDto.username;
    user.password = createUserDto.password;
    user.email = createUserDto.email;
    user.firstName = createUserDto.firstName;
    user.lastName = createUserDto.lastName;

    return {
      ...(await this.authService.createUser(user)),
      token: await this.authService.getTokenForUser(user)
    };
  }
}