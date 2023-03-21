import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";


@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>
  ) { }

  private getEventsBaseQuery() {
    return this.eventsRepository
      .createQueryBuilder("event")
      .orderBy("event.id", "DESC");
  }

  public async getEvents(): Promise<Event[]> {
    return await this.getEventsBaseQuery().getMany();
  }

  public getEventsWithAttendeesCountQuery() {
    // const query = this.getEventsBaseQuery()
    //   .addSelect("COUNT(attendee.id)", "attendeesCount")
    //   .leftJoin("event.attendees", "attendee")
    //   .groupBy("event.id");
    // return await query.getMany();
      const query = this.getEventsBaseQuery()
        .loadRelationCountAndMap("event.attendeesCount", "event.attendees")

        return query;
  }

  public async getEventById(id: number): Promise<Event | undefined> {
    const query = this.getEventsWithAttendeesCountQuery()
      .where("event.id = :id", { id })

    this.logger.log(query.getSql());
    return await query.getOne();
  }

}