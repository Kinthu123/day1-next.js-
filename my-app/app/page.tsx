import ExploreBtn from "@/components/ExploreBtn"
import EventCard from "@/components/EventCard"
import { IEvent } from "@/database/event.model";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default async function Page() {
  let events: IEvent[] = [];
  try {
    const response = await fetch(`${BASE_URL}/api/events`, { cache: 'no-store' });
    if (response.ok) {
      const data = await response.json();
      events = data.events;
    }
  } catch (error) {
    console.error("Failed to fetch events:", error);
  }

  return (
    <section>
      <h1 className="text-center mt-8">The Hub for Every Developer<br /> Event You Cannot Miss</h1>
      <p className="text-center mt-4">Hackathon, Meetups, and Conferences, All in One Place</p>
      <ExploreBtn />

      <div className="mt-20 space-y-8 px-8">
        <h3>Featured Events</h3>

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
      </div>
    </section>
  )
}