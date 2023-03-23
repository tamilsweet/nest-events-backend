import { Expose } from "class-transformer";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./../auth/user.entity";
import { PaginationResult } from "./../pagination/paginator";
import { Attendee } from "./attendee.entity";


@Entity()
export class Event {

  constructor(partial?: Partial<Event>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Column()
  @Expose()
  name: string;

  @Column()
  @Expose()
  description: string;

  @Column()
  @Expose()
  when: Date;

  @Column()
  @Expose()
  address: string;

  @OneToMany(() => Attendee, (attendee) => attendee.event, {
    eager: true,
    cascade: ['insert', 'update']
  })
  @Expose()
  attendees: Attendee[];

  @ManyToOne(() => User, (user) => user.organized, { eager: false })
  @JoinColumn({ name: 'organizerId' })
  @Expose()
  organizer: User;

  @Column({
    nullable: true
  })
  organizerId: number;

  // Virtual property or column that is not stored in the database
  @Expose()
  attendeesCount?: number;

  @Expose()
  attendeeRejected?: number;
  @Expose()
  attendeeAccepted?: number;
  @Expose()
  attendeeMaybe?: number;
}

export type PaginatedEvents = PaginationResult<Event>;