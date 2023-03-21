import { Body, Controller, Delete, Get, HttpCode, Logger, NotFoundException, Param, ParseIntPipe, Patch, Post, ValidationPipe } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Like, MoreThan, Repository } from "typeorm";
import { Attendee } from "./attendee.entity";
import { Event } from './event.entity';
import { CreateEventDto } from './input/create-event.dto';
import { UpdateEventDto } from "./input/update-event.dto";

@Controller('/events')
export class EventsController {

  private readonly logger = new Logger(EventsController.name);

  constructor(
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,
    @InjectRepository(Attendee)
    private readonly attendeesRepository: Repository<Attendee>
  ) { }

  // Get all events from the database
  @Get()
  async findAll(): Promise<Event[]> {
    this.logger.log('Getting all events');
    const events = await this.eventsRepository.find();
    this.logger.debug(`Found ${events.length} events`);
    return events;
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
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Event> {
    const event = await this.eventsRepository.findOneBy({ id });

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
  async create(@Body(new ValidationPipe({ groups: ['create'] })) input: CreateEventDto): Promise<Event> {
    const event = {
      ...input,
      when: new Date(input.when)
    }
    return await this.eventsRepository.save(event);
  }

  // Update an event in the database
  // INFO: Need to disable global validation pipe to use groups
  @Patch(':id')
  async update(
    @Param('id') id,
    @Body(new ValidationPipe({ groups: ['update'] })) input: UpdateEventDto
  ): Promise<Event> {
    const event = await this.eventsRepository.findOneBy({ id });

    if (!event) {
      throw new NotFoundException();
    }

    return await this.eventsRepository.save({
      ...event,
      ...input,
      when: input.when ? new Date(input.when) : event.when
    });
  }

  // Delete an event from the database
  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id): Promise<void> {
    const event = await this.eventsRepository.findOneBy({ id });

    if (!event) {
      throw new NotFoundException();
    }

    await this.eventsRepository.remove(event);
  }
}