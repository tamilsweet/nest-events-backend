import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendee } from './attendee.entity';
import { AttendeeService } from './attendee.service';
import { EventAttendeesController } from './event-attendees.controller';
import { Event } from './event.entity';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, Attendee])
  ],
  controllers: [EventsController, EventAttendeesController],
  providers: [EventsService, AttendeeService]
})
export class EventsModule { }
