import ExploreBtn from "@/components/ExploreBtn"
import EventList from "@/components/EventList"
import { Suspense } from "react";

export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <section>
      <h1 className="text-center mt-8">The Hub for Every Developer<br /> Event You Cannot Miss</h1>
      <p className="text-center mt-4">Hackathon, Meetups, and Conferences, All in One Place</p>
      <ExploreBtn />

      <div className="mt-20 space-y-8 px-8">
        <h3>Featured Events</h3>
        <Suspense fallback={<p className="text-center">Loading events...</p>}>
          <EventList />
        </Suspense>
      </div>
    </section>
  )
}