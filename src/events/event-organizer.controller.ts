import { ClassSerializerInterceptor, Controller, Get, Param, Query, SerializeOptions, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthGuardJwt } from "src/auth/auth-guard.jwt";
import { EventsService } from "./events.service";

@Controller("event-organizer/:userId")
@SerializeOptions({
  strategy: "excludeAll"
})
export class EventOrganizerController {
  constructor(
    private readonly eventsService: EventsService
  ) { }


  @Get()
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(
    @Param('userId') userId: number,
    @Query('page') page = 1,
  ) {
    return await this.eventsService.getEventsOrganizedByUserIdFilteredAndPaginated(
      userId,
      {
        currentPage: Number(page),
        limit: 10
      }
    );
  }
}