import EventCard from "@/components/EventCard";
import { IEvent } from "@/database/event.model";
import { getAllEvents } from "@/lib/actions/event.actions";

export default async function EventList() {
  let events: IEvent[] = [];
  try {
    events = await getAllEvents();
  } catch (error) {
    console.error("Failed to fetch events:", error);
  }

  return (
    <ul className="events">
      {events && events.length > 0 ? (
        events.map((event: IEvent) => (
          <li key={event._id as unknown as string}>
            <EventCard {...event} />
          </li>
        ))
      ) : (
        <p className="text-center text-gray-500">No events found.</p>
      )}
    </ul>
  );
}
