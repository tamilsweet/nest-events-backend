import { Event } from './event.entity';

test('Event should be initialized through constructor', () => {
  const event = new Event({
    name: 'Test Event',
    description: 'Test Description',
  });

  console.log(event);

  expect(event).toEqual({
    name: 'Test Event',
    description: 'Test Description',
    id: undefined,
    when: undefined,
    address: undefined,
    attendees: undefined,
    organizer: undefined,
    organizerId: undefined,
    events: undefined,
    attendeesCount: undefined,
    attendeeRejected: undefined,
    attendeeAccepted: undefined,
    attendeeMaybe: undefined
  });
});