// Add entity for attendees
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
  id: number;

  @Column()
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

  @Column('enum', {
    enum: AttendeeStatusEnum,
    default: AttendeeStatusEnum.ATTENDING
  })
  answer: AttendeeStatusEnum;
}