import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as paginator from './../pagination/paginator';
import { Event } from "./event.entity";
import { EventsService } from "./events.service";

jest.mock('./../pagination/paginator');

describe('EventsService', () => {
  let service: EventsService;
  let repository: Repository<Event>;
  let selectQb: any;
  let deleteQb: any;
  let mockedPaginate: any;

  beforeEach(async () => {

    mockedPaginate = paginator.paginate as jest.Mock;

    deleteQb = {
      where: jest.fn(),
      execute: jest.fn(),
    };

    selectQb = {
      delete: jest.fn().mockReturnValue(deleteQb),
      where: jest.fn(),
      execute: jest.fn(),
      orderBy: jest.fn(),
      leftJoinAndSelect: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getRepositoryToken(Event),
          useValue: {
            save: jest.fn(),
            delete: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnValue(selectQb),
            where: jest.fn(),
            execute: jest.fn(),
            findOneBy: jest.fn(),
            leftJoinAndSelect: jest.fn(),
          },
        }
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    repository = module.get<Repository<Event>>(getRepositoryToken(Event));

  });

  describe('updateEventById', () => {

    it('should update an event', async () => {
      const repoSpy = jest
        .spyOn(repository, 'save')
        .mockResolvedValue({ id: 1 } as Event);

      expect(service.updateEventById(
        new Event({ id: 1 }),
        { name: 'New Name' }
      )).resolves.toEqual({ id: 1 })
      expect(repoSpy).toBeCalledWith({ id: 1, name: 'New Name' });
    });
  });

  describe('deleteEventById', () => {

    it('should delete an event', async () => {
      const createQueryBuilderSpy = jest.spyOn(repository, 'createQueryBuilder');
      const deleteSpy = jest.spyOn(selectQb, 'delete').mockReturnValue(deleteQb);
      const whereSpy = jest.spyOn(deleteQb, 'where').mockReturnValue(deleteQb);
      const executeSpy = jest.spyOn(deleteQb, 'execute');

      // Call the service deleteEventById method
      expect(service.deleteEventById(1)).resolves.toBeUndefined();
      expect(createQueryBuilderSpy).toBeCalledWith('event');
      expect(createQueryBuilderSpy).toBeCalledTimes(1);

      expect(deleteSpy).toBeCalledTimes(1);
      expect(whereSpy).toBeCalledTimes(1);
      expect(whereSpy).toBeCalledWith('id = :id', { id: 1 });
      expect(executeSpy).toBeCalledTimes(1);
    });
  });

  describe('getEventsAttendedByUserIdFilteredAndPaginated', () => {
    it('should return a list of paginated events', async () => {
      const orderBySpy = jest.spyOn(selectQb, 'orderBy').mockReturnValue(selectQb);
      const leftJoinAndSelectSpy = jest.spyOn(selectQb, 'leftJoinAndSelect').mockReturnValue(selectQb);
      const whereSpy = jest.spyOn(selectQb, 'where').mockReturnValue(selectQb);

      mockedPaginate.mockResolvedValueOnce({
        first: 1, last: 1, total: 10, limit: 10, data: []
      });

      // Call the service getEventsAttendedByUserIdFilteredAndPaginated method
      expect(service.getEventsAttendedByUserIdFilteredAndPaginated(
        1,
        { limit: 10, currentPage: 1, total: true })
      ).resolves.toEqual({
        first: 1, last: 1, total: 10, limit: 10, data: []
      });
      expect(orderBySpy).toBeCalledTimes(1);
      expect(orderBySpy).toBeCalledWith('event.id', 'DESC');

      expect(leftJoinAndSelectSpy).toBeCalledTimes(1);
      expect(leftJoinAndSelectSpy).toBeCalledWith('event.attendees', 'attendee');

      expect(whereSpy).toBeCalledTimes(1);
      expect(whereSpy).toBeCalledWith('attendee.userId = :userId', { userId: 1 });

      expect(mockedPaginate).toBeCalledTimes(1);
      expect(mockedPaginate).toBeCalledWith(
        selectQb,
        { limit: 10, currentPage: 1, total: true }
      );
    });
  });
});