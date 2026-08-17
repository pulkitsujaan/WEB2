import { EventCard } from "@/components/public/EventCard";
import { connectDB } from "@/lib/db";
import Event from "@/models/Event";

export const metadata = {
  title: "Events | EPMOC",
  description: "Upcoming and past events organised by EPMOC at IIIT Una.",
};

export default async function EventsPage() {
  let events: Array<any> = [];

  try {
    await connectDB();
    events = await Event.find({ isPublished: true })
      .sort({ date: 1 })
      .limit(24)
      .lean();
  } catch {
    events = [];
  }

  const now = new Date();
  const upcoming = events.filter((event) => new Date(event.date) >= now);
  const past = events.filter((event) => new Date(event.date) < now);

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="container-section py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            Club Events
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            From Institue events to Cultural fests — EPMOC organises diverse events throughout the year.
          </p>
        </div>

        {upcoming.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Upcoming Events</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcoming.map((event) => (
                <EventCard key={String(event._id)} event={event} upcoming />
              ))}
            </div>
          </section>
        )}

        {past.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Past Events</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {past.map((event) => (
                <EventCard key={String(event._id)} event={event} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}