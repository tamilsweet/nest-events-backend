// Add entity for attendees
import { Expose } from 'class-transformer';
import { User } from 'src/auth/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Event } from './event.entity';

export enum AttendeeStatusEnum {
  ATTENDING = 'attending',
  NOT_ATTENDING = 'not attending',
  MAY_BE_ATTENDING = 'may be attending'
}

@Entity()
export class Attendee {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Column()
  @Expose()
  name: string;

  // @Column()
  // email: string;

  @ManyToOne(() => Event, (event) => event.attendees, {
    nullable: false
  })
  @JoinColumn({
    name: 'eventId'
  })
  event: Event;

  @Column()
  eventId: number;

  @Column('enum', {
    enum: AttendeeStatusEnum,
    default: AttendeeStatusEnum.ATTENDING
  })
  @Expose()
  answer: AttendeeStatusEnum;

  @ManyToOne(() => User, (user) => user.attended, {
    nullable: true
  })
  @JoinColumn({
    name: 'userId'
  })
  user: User;

  @Column()
  userId: number;
}