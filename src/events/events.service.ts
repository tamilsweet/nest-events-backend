import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, Repository, SelectQueryBuilder } from "typeorm";
import { User } from "./../auth/user.entity";
import { paginate, PaginateOptions } from "./../pagination/paginator";
import { AttendeeStatusEnum } from "./attendee.entity";
import { Event, PaginatedEvents } from "./event.entity";
import { CreateEventDto } from "./input/create-event.dto";
import { ListEvents, WhenEventFilterEnum } from "./input/list-events";
import { UpdateEventDto } from "./input/update-event.dto";


@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>
  ) { }

  private getEventsBaseQuery(): SelectQueryBuilder<Event> {
    return this.eventsRepository
      .createQueryBuilder("event")
      .orderBy("event.id", "DESC");
  }

  public async getEvents(): Promise<Event[]> {
    return await this.getEventsBaseQuery().getMany();
  }

  public getEventsWithAttendeesCountQuery(): SelectQueryBuilder<Event> {
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

  private getEventsWithAttendeesCountFilteredQuery(filter?: ListEvents): SelectQueryBuilder<Event> {
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
  ): Promise<PaginatedEvents> {
    return await paginate(
      await this.getEventsWithAttendeesCountFilteredQuery(filter),
      paginateOptions
    )
  }

  public async getEventByIdWithAttendeesCount(id: number): Promise<Event | undefined> {
    const query = this.getEventsWithAttendeesCountQuery()
      .where("event.id = :id", { id })

    this.logger.log(query.getSql());
    return await query.getOne();
  }

  public async getEventById(id: number): Promise<Event | undefined> {
    return await this.eventsRepository.findOneBy({ id });
  }

  public async createEvent(input: CreateEventDto, user: User): Promise<Event> {
    const event = new Event({
      ...input,
      organizer: user,
      when: new Date(input.when)
    });
    return await this.eventsRepository.save(event);
  }

  public async deleteEventById(id: number): Promise<DeleteResult> {
    return await this.eventsRepository
      .createQueryBuilder('event')
      .delete()
      .where("id = :id", { id })
      .execute();
  }

  public async updateEventById(event: Event, input: UpdateEventDto): Promise<Event> {
    const updatedEvent = new Event({
      ...event,
      ...input,
      when: input.when ? new Date(input.when) : event.when
    });
    return await this.eventsRepository.save(updatedEvent);
  }

  private async getEventsOrganizedByUserIdQuery(organizerId: number) {
    return this.getEventsBaseQuery()
      .where("event.organizerId = :organizerId", { organizerId })
  }

  public async getEventsOrganizedByUserIdFilteredAndPaginated(
    organizerId: number,
    paginateOptions: PaginateOptions
  ): Promise<PaginatedEvents> {
    return await paginate<Event>(
      await this.getEventsOrganizedByUserIdQuery(organizerId),
      paginateOptions
    );
  }

  private getEventsAttendedByUserIdQuery(userId: number): SelectQueryBuilder<Event> {
    return this.getEventsBaseQuery()
      .leftJoinAndSelect("event.attendees", "attendee")
      .where("attendee.userId = :userId", { userId })
  }

  public async getEventsAttendedByUserIdFilteredAndPaginated(
    userId: number,
    paginateOptions: PaginateOptions
  ): Promise<PaginatedEvents> {
    return await paginate<Event>(
      this.getEventsAttendedByUserIdQuery(userId),
      paginateOptions
    );
  }
}