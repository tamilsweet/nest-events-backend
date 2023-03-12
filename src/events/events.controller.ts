import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from "@nestjs/common";
import { CreateEventDto } from './input/create-event.dto';
import { Event } from './event.entity';
import { UpdateEventDto } from "./input/update-event.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Controller('/events')
export class EventsController {
  constructor(
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>
  ) { }

  // Get all events from the database
  @Get()
  async findAll(): Promise<Event[]> {
    return await this.eventsRepository.find();
  }

  // Get one event from the database
  @Get(':id')
  async findOne(@Param('id') id): Promise<Event> {
    return await this.eventsRepository.findOneBy({ id });
  }

  // Create a new event in the database
  @Post()
  async create(@Body() input: CreateEventDto): Promise<Event> {
    const event = {
      ...input,
      when: new Date(input.when)
    }
    return await this.eventsRepository.save(event);
  }

  // Update an event in the database
  @Patch(':id')
  async update(@Param('id') id, @Body() input: UpdateEventDto): Promise<Event> {
    const event = await this.eventsRepository.findOneBy({ id });

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
    await this.eventsRepository.remove(event);
  }
}