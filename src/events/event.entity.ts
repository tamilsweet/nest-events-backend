import { User } from "src/auth/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
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

  @ManyToOne(() => User, (user) => user.organized, { eager: false })
  @JoinColumn({ name: 'organizerId' })
  organizer: User;

  @Column({ 
    nullable: true
  })
  organizerId: number;

  // Virtual property or column that is not stored in the database
  attendeesCount?: number;

  attendeeRejected?: number;
  attendeeAccepted?: number;
  attendeeMaybe?: number;
}