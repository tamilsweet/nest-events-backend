// Add entity for attendees
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Event } from './event.entity';

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
}