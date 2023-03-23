import { Body, ClassSerializerInterceptor, Controller, DefaultValuePipe, Get, Logger, NotFoundException, Param, ParseIntPipe, Put, Query, SerializeOptions, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthGuardJwt } from "src/auth/auth-guard.jwt";
import { CurrentUser } from "src/auth/current-user.decorator";
import { User } from "src/auth/user.entity";
import { AttendeeService } from "./attendee.service";
import { EventsService } from "./events.service";
import { CreateAttendeeDto } from "./input/create-attendee.dto";


@Controller('events-attendance')
@SerializeOptions({
  strategy: 'excludeAll'
})
export class CurrentUserEventAttendanceController {
  private readonly logger = new Logger(CurrentUserEventAttendanceController.name);

  constructor(
    private readonly attendeeService: AttendeeService,
    private readonly eventsService: EventsService
  ) { }

  @Get()
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(
    @CurrentUser() user: User,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1
  ) {
    return await this.eventsService.getEventsAttendedByUserIdFilteredAndPaginated(
      user.id,
      {
        currentPage: page,
        limit: 10
      }
    );
  }

  @Get(':eventId')
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(
    @Param('eventId', ParseIntPipe) eventId: number,
    @CurrentUser() user: User
  ) {
    const attendee = this.attendeeService.findOneByEventIdAndUserId(eventId, user.id);

    if (!attendee) {
      throw new NotFoundException();
    }

    return attendee;
  }

  @Put(':eventId')
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  async createOrUpdate(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Body() input: CreateAttendeeDto,
    @CurrentUser() user: User
  ) {
    this.logger.log('createOrUpdate()');
    this.logger.log(eventId);
    this.attendeeService.createOrUpdate(input, eventId, user.id);
  }
}