import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Attendee } from "./attendee.entity";
import { CreateAttendeeDto } from "./input/create-attendee.dto";


@Injectable()
export class AttendeeService {
  constructor(
    @InjectRepository(Attendee)
    private attendeeRepository: Repository<Attendee>,
  ) { }

  public async findByEventId(eventId: number): Promise<Attendee[]> {
    return await this.attendeeRepository.find({
      where: {
        id: eventId
      }
    });
  }

  // Find attendee by event id and user id
  // Used to check if user is already attending event
  // Returns undefined if not found
  // Returns Attendee if found
  public async findOneByEventIdAndUserId(
    eventId: number,
    userId: number
  ): Promise<Attendee | undefined> {
    return await this.attendeeRepository.findOne({
      where: {
        eventId,
        userId
      }
    });
  }

  public async createOrUpdate(
    input: CreateAttendeeDto, eventId: number, userId: number
  ): Promise<Attendee> {
    const attendee = await this.findOneByEventIdAndUserId(eventId, userId) ?? new Attendee();


    attendee.eventId = eventId;
    attendee.userId = userId;
    attendee.answer = input.answer;

    return await this.attendeeRepository.save(attendee);
  }

}