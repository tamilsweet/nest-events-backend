import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Attendee } from "./attendee.entity";

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  when: Date;

  @Column()
  address: string;

  @OneToMany(() => Attendee, (attendee) => attendee.event, {
    eager: true,
    cascade: ['insert', 'update']
  })
  attendees: Attendee[];

  // Virtual property or column that is not stored in the database
  attendeesCount?: number;

  attendeeRejected?: number;
  attendeeAccepted?: number;
  attendeeMaybe?: number;
}