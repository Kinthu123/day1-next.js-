export type EventItem=
  { image: string;
    title: string;
    slug: string;
    location: string;
    date: string;
    time: string;
    };


export const events: EventItem[] = [
  {
    image: "/images/event1.png",
    title: "React Universe Conf",
    slug: "react-universe-conf",
    location: "San Francisco, CA",
    date: "Oct 25, 2025",
    time: "09:00 AM",
  },
  {
    image: "/images/event2.png",
    title: "AI for Developers Summit",
    slug: "ai-developers-summit",
    location: "Seattle, WA",
    date: "Nov 12, 2025",
    time: "10:00 AM",
  },
  {
    image: "/images/event3.png",
    title: "FullStack London 2025",
    slug: "fullstack-london",
    location: "London, UK",
    date: "Dec 05, 2025",
    time: "08:30 AM",
  },
  {
    image: "/images/event4.png",
    title: "EthGlobal Hackathon",
    slug: "ethglobal-hackathon",
    location: "New York, NY",
    date: "Jan 15, 2026",
    time: "09:00 AM",
  },
  {
    image: "/images/event5.png",
    title: "Vue.js Amsterdam",
    slug: "vuejs-amsterdam",
    location: "Amsterdam, NL",
    date: "Feb 20, 2026",
    time: "09:30 AM",
  },
  {
    image: "/images/event6.png",
    title: "TechCrunch Disrupt",
    slug: "techcrunch-disrupt",
    location: "Las Vegas, NV",
    date: "Mar 10, 2026",
    time: "11:00 AM",
  },
];
