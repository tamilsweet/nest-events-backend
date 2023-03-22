import { ClassSerializerInterceptor, Controller, Get, Logger, Param, SerializeOptions, UseInterceptors } from "@nestjs/common";
import { Attendee } from "./attendee.entity";
import { AttendeeService } from "./attendee.service";


@Controller('events/:eventId/attendees')
@SerializeOptions({
  strategy: 'excludeAll'
})
export class EventAttendeesController {
  private readonly logger = new Logger(EventAttendeesController.name);

  constructor(
    private readonly attendeeService: AttendeeService,
  ) { }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(@Param('eventId') eventId: number): Promise<Attendee[]> {
    this.logger.log(`Finding all attendees for event ${eventId}`);
    return await this.attendeeService.findByEventId(eventId);
  }
}