import { ClassSerializerInterceptor, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Query, SerializeOptions, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthGuardJwt } from "src/auth/auth-guard.jwt";
import { EventsService } from "./events.service";

@Controller("event-organizer/:userId")
@SerializeOptions({
  strategy: "excludeAll"
})
export class EventOrganizedByUserController {
  constructor(
    private readonly eventsService: EventsService
  ) { }


  @Get()
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
  ) {
    return await this.eventsService.getEventsOrganizedByUserIdFilteredAndPaginated(
      userId,
      {
        currentPage: page,
        limit: 10
      }
    );
  }
}