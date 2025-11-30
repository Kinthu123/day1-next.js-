import ExploreBtn from "@/components/ExploreBtn"
import EventCard from "@/components/EventCard"
import { events } from "@/lib/constants"




const page = () => {
  return (
    <section>
      <h1 className="text-center mt-8">The Hub for Every Developer<br /> Event You Cannot Miss</h1>
      <p className="text-center mt-4">Hackathon, Meetups, and Conferences, All in One Place</p>
      <ExploreBtn />

      <div className="mt-20 space-y-8 px-8">
        <h3>Featured Events</h3>

        <ul className="events">
          {events.map((event)=>(
            <li key={event.title}>
              <EventCard {...event}/>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default page