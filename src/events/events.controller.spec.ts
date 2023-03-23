import { NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "./../auth/user.entity";
import { Event } from "./event.entity";
import { EventsController } from "./events.controller";
import { EventsService } from "./events.service";
import { ListEvents } from "./input/list-events";

describe('EventsController', () => {
  let eventsController: EventsController;
  let eventsService: EventsService;
  let eventsRepository: Repository<Event>;

  beforeEach(() => {
    eventsService = new EventsService(eventsRepository);
    eventsController = new EventsController(eventsRepository, eventsService);
  });

  it('should return a list of events', async () => {
    const result = {
      first: 1,
      last: 1,
      limit: 10,
      data: []
    }

    // eventsService.getEventsWithAttendeesCountFilteredAndPaginated = jest.fn().mockResolvedValue(result);
    // eventsService.getEventsWithAttendeesCountFilteredAndPaginated = jest.fn().mockImplementation(() => result);

    const spy = jest
      .spyOn(eventsService, 'getEventsWithAttendeesCountFilteredAndPaginated')
      .mockResolvedValue(result);

    const events = await eventsController.findAll(new ListEvents());
    expect(spy).toBeCalledTimes(1);
    expect(events).toEqual(result);
  });

  it('should not delete an event, when its not found', async () => {
    const id = 1;
    const findSpy = jest.spyOn(eventsService, 'getEventById').mockResolvedValue(undefined);
    const deleteSpy = jest.spyOn(eventsService, 'deleteEventById');

    try {
      await eventsController.remove(id, new User());
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
    }
    
    expect(findSpy).toBeCalledTimes(1);
    expect(deleteSpy).toBeCalledTimes(0);
  });
});