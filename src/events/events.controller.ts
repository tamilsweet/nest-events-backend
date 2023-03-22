import { Body, Controller, Delete, ForbiddenException, Get, HttpCode, Logger, NotFoundException, Param, ParseIntPipe, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthGuardJwt } from "src/auth/auth-guard.jwt";
import { CurrentUser } from "src/auth/current-user.decorator";
import { User } from "src/auth/user.entity";
import { Like, MoreThan, Repository } from "typeorm";
import { Attendee } from "./attendee.entity";
import { Event } from './event.entity';
import { EventsService } from "./events.service";
import { CreateEventDto } from './input/create-event.dto';
import { ListEvents } from "./input/list-events";
import { UpdateEventDto } from "./input/update-event.dto";


@Controller('/events')
export class EventsController {

  private readonly logger = new Logger(EventsController.name);

  constructor(
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,
    @InjectRepository(Attendee)
    private readonly attendeesRepository: Repository<Attendee>,
    private readonly eventsService: EventsService
  ) { }

  // Get all events from the database
  @Get()
  // Populate the default values for the query parameters using the ValidationPipe transform option
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(@Query() filter: ListEvents) {
    this.logger.log('Getting all events');
    const events = await this.eventsService.getEventsWithAttendeesCountFilteredAndPaginated(
      filter,
      {
        limit: filter.limit,
        total: true,
        currentPage: filter.page
      }
    );
    // this.logger.debug(`Found ${events.length} events`);
    return events;
  }

  @Get('/practice3')
  async practice3(): Promise<Event[]> {
    // Get one event using query builder
    // return await this.eventsRepository.createQueryBuilder('event')
    //   .select(['event.id', 'event.name'])
    //   .where('event.id = :id', { id: 1 })
    //   .execute();

    return await this.eventsRepository.createQueryBuilder('event')
      .select(['event.id', 'event.name'])
      .orderBy('event.id', 'DESC')
      .getMany();

    // Get one event using query builder and eager load attendees
    // return await this.eventsRepository.createQueryBuilder('event')
    //   .select(['event.id', 'event.name'])
    //   .leftJoinAndSelect('event.attendees', 'attendee')
    //   .where('event.id = :id', { id: 1 })
    //   .execute();

    // Get one event using query builder and eager load attendees and their user
    // return await this.eventsRepository.createQueryBuilder('event')
    //   .select(['event.id', 'event.name'])
    //   .leftJoinAndSelect('event.attendees', 'attendee')
    //   .leftJoinAndSelect('attendee.user', 'user')
    //   .where('event.id = :id', { id: 1 })
    //   .execute();

    // Get one event using query builder and eager load attendees and their user and their profile
    // return await this.eventsRepository.createQueryBuilder('event')
    //   .select(['event.id', 'event.name'])
    //   .leftJoinAndSelect('event.attendees', 'attendee')
    //   .leftJoinAndSelect('attendee.user', 'user')
    //   .leftJoinAndSelect('user.profile', 'profile')
    //   .where('event.id = :id', { id: 1 })
    //   .execute();


  }

  @Get('/practice2')
  async practice2(): Promise<Event> {
    // Get one event by id
    // return await this.eventsRepository.findOneBy({ id: 1 });

    // Get one event by id and eager load attendees
    // return await this.eventsRepository.findOne({
    //   select: { id: true },
    //   where: { id: 1 },
    //   relations: ['attendees']
    // });

    // // Create a new attendee and associate it with an event
    // const event = await this.eventsRepository.findOneBy({ id: 1 });
    // const attendee = new Attendee();
    // attendee.name = 'John Doe';
    // attendee.event = event;
    // // Save the attendee to the database
    // await this.attendeesRepository.save(attendee);
    // // TODO: Fix attendee not being add to event.attendees list
    // return event;

    const event = await this.eventsRepository.findOne({
      where: { id: 1 },
      relations: ['attendees']
    });
    const attendee = new Attendee();
    attendee.name = 'John Doe New';
    event.attendees.push(attendee);

    // Save the attendee to the database
    await this.eventsRepository.save(event);
    return event;

    // Get one event by id and eager load attendees and their user
    // return await this.eventsRepository.findOne({
    //   select: { id: true },
    //   where: { id: 1 },
    //   relations: ['attendees', 'attendees.user']
    // });

    // Get one event by id and eager load attendees and their user and their profile
    // return await this.eventsRepository.findOne({
    //   select: { id: true },
    //   where: { id: 1 },
    //   relations: ['attendees', 'attendees.user', 'attendees.user.profile']
    // });
  }

  @Get('/practice')
  async practice(): Promise<Event[]> {
    const events = await this.eventsRepository.find({
      select: ['id', 'name', 'when', 'address', 'description'],
      // where: { id: 3 }

      // where: { id: MoreThan(3) }

      // AND condition in where clause
      // where: {
      //   id: MoreThan(3),
      //   when: MoreThan(new Date('2023-03-10T10:00:00'))
      // }

      // OR condition in where clause
      where: [{
        id: MoreThan(3),
        when: MoreThan(new Date('2023-03-10T10:00:00'))
      }, {
        description: Like('%meet%')
      }],
      take: 2,
      skip: 1,
      order: {
        id: 'DESC'
      }
    });
    return events;
  }

  // Get one event from the database
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const event = await this.eventsService.getEventById(id);

    if (!event) {
      throw new NotFoundException();
    }

    return event;
  }

  // Create a new event in the database
  // TODO: Handle exceptions if when field is not a valid date
  //   [Nest] 20196  - 18/03/2023, 2:39:09 pm   ERROR [ExceptionsHandler] ER_BAD_NULL_ERROR: Column 'when' cannot be null
  // QueryFailedError: ER_BAD_NULL_ERROR: Column 'when' cannot be null
  @Post()
  @UseGuards(AuthGuardJwt)
  async create(
    @Body(new ValidationPipe({ groups: ['create'] })) input: CreateEventDto,
    @CurrentUser() user: User
  ): Promise<Event> {
    return await this.eventsService.createEvent(input, user);
  }

  // Update an event in the database
  // INFO: Need to disable global validation pipe to use groups
  @Patch(':id')
  @UseGuards(AuthGuardJwt)
  async update(
    @Param('id') id,
    @Body(new ValidationPipe({ groups: ['update'] })) input: UpdateEventDto,
    @CurrentUser() user: User
  ): Promise<Event> {
    const event = await this.eventsService.getEventById(id);

    if (!event) {
      throw new NotFoundException();
    }

    if (event.organizerId !== user.id) {
      throw new ForbiddenException(null, 'You are not authorized to change this event.');
    }

    return this.eventsService.updateEventById(event, input);
  }

  // Delete an event from the database
  @Delete(':id')
  @HttpCode(204)
  @UseGuards(AuthGuardJwt)
  async remove(
    @Param('id') id,
    @CurrentUser() user: User
  ): Promise<void> {

    const event = await this.eventsService.getEventById(id);

    if (!event) {
      throw new NotFoundException();
    }

    if (event.organizerId !== user.id) {
      throw new ForbiddenException(null, 'You are not authorized to delete this event.');
    }

    await this.eventsService.deleteEventById(id);
  }
}