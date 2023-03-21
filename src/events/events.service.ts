import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { paginate, PaginateOptions } from "src/pagination/paginator";
import { DeleteResult, Repository } from "typeorm";
import { AttendeeStatusEnum } from "./attendee.entity";
import { Event } from "./event.entity";
import { ListEvents, WhenEventFilterEnum } from "./input/list-events";


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
      .loadRelationCountAndMap(
        "event.attendeesCount", "event.attendees"
      )
      .loadRelationCountAndMap(
        "event.attendeeAccepted", "event.attendees", "attendee",
        qb => qb.andWhere("attendee.answer = :answer", { answer: AttendeeStatusEnum.ATTENDING })
      )
      .loadRelationCountAndMap(
        "event.attendeeRejected", "event.attendees", "attendee",
        qb => qb.andWhere("attendee.answer = :answer", { answer: AttendeeStatusEnum.NOT_ATTENDING })
      )
      .loadRelationCountAndMap(
        "event.attendeeMaybe", "event.attendees", "attendee",
        qb => qb.andWhere("attendee.answer = :answer", { answer: AttendeeStatusEnum.MAY_BE_ATTENDING })
      )
    return query;
  }

  private getEventsWithAttendeesCountQueryFiltered(filter?: ListEvents): any {
    let query = this.getEventsWithAttendeesCountQuery();

    this.logger.debug('Filter is ', filter);
    this.logger.debug(query.getSql());
    if (!filter) {
      return query;
    }

    switch (filter.when) {
      case WhenEventFilterEnum.TODAY:
        query = query.andWhere("event.when >= CURDATE() AND event.when <= CURDATE() + INTERVAL 1 DAY");

        break;
      case WhenEventFilterEnum.TOMORROW:
        query = query.andWhere("event.when >= CURDATE() + INTERVAL 1 DAY AND event.when <= CURDATE() + INTERVAL 2 DAY");
        break;
      case WhenEventFilterEnum.THIS_WEEK:
        // query = query.andWhere("event.when >= CURDATE() AND event.when <= CURDATE() + INTERVAL 7 DAY");
        query = query.andWhere("YEARWEEK(event.when, 1) = YEARWEEK(CURDATE(), 1)");
        break;
      case WhenEventFilterEnum.NEXT_WEEK:
        query = query.andWhere("YEARWEEK(event.when, 1) = YEARWEEK(CURDATE(), 1) + 1");
      case WhenEventFilterEnum.ALL:
      default:
        break;
    }

    this.logger.debug(query.getSql());
    return query;
  }

  public async getEventsWithAttendeesCountFilteredAndPaginated(
    filter: ListEvents,
    paginateOptions: PaginateOptions
  ) {
    return await paginate(
      await this.getEventsWithAttendeesCountQueryFiltered(filter),
      paginateOptions
    )
  }

  public async getEventById(id: number): Promise<Event | undefined> {
    const query = this.getEventsWithAttendeesCountQuery()
      .where("event.id = :id", { id })

    this.logger.log(query.getSql());
    return await query.getOne();
  }

  public async deleteEventById(id: number): Promise<DeleteResult> {
    return await this.eventsRepository
      .createQueryBuilder('event')
      .delete()
      .where("id = :id", { id })
      .execute();
  }
}