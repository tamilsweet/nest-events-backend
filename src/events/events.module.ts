import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendee } from './attendee.entity';
import { AttendeeService } from './attendee.service';
import { CurrentUserEventAttendanceController } from './current-user-event-attendance.controller';
import { EventAttendeesController } from './event-attendees.controller';
import { EventOrganizerController } from './event-organizer.controller';
import { Event } from './event.entity';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, Attendee])
  ],
  controllers: [
    EventsController,
    EventAttendeesController,
    EventOrganizerController,
    CurrentUserEventAttendanceController
  ],
  providers: [EventsService, AttendeeService]
})
export class EventsModule { }
