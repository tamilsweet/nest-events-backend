// User entity

import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Profile } from "./profile.entity";
import { Event } from "../events/event.entity";
import { Expose } from "class-transformer";
import { Attendee } from "src/events/attendee.entity";

@Entity()
export class User {

  constructor(partial?: Partial<User>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Column({ unique: true })
  @Expose()
  username: string;

  @Column()
  password: string;

  @Column({ unique: true })
  @Expose()
  email: string;

  @Column()
  @Expose()
  firstName: string;

  @Column()
  @Expose()
  lastName: string;

  @OneToOne(() => Profile, (profile) => profile.user)
  @JoinColumn()
  @Expose()
  profile: Profile;

  @OneToMany(() => Event, (event) => event.organizer)
  @Expose()
  organized: Event[];

  // Do not use Expose() decorator here
  // because we do not want circular references
  // in the JSON response
  @OneToMany(() => Attendee, (attendee) => attendee.user)
  attended: Attendee[];
}