// Profile Entity

import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  age: number;

  @OneToOne(() => User, (user) => user.profile)
  user: User;
}