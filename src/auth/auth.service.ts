// Auth Service
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from './user.entity';


@Injectable()
export class AuthService {

  readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) { }

  public async validateUser(username: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { username },
    });
    return user;
  }

  public async getTokenForUser(user: User): Promise<string> {
    const payload = { username: user.username, sub: user.id };
    return this.jwtService.sign(payload);
  }

  public async hashPassword(password: string): Promise<string> {
    // Hash the password
    return await bcrypt.hash(password, 10);
  }

  public async userExists(username: string, email: string) {
    return await this.userRepository.findOne({
      where: [{ username }, { email }],
    });
  }

  public async createUser(user: User) {
    this.logger.log('Creating user...');
    user.password = await this.hashPassword(user.password);
    return await this.userRepository.save(user);
  }
}