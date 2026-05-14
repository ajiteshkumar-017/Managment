"use client";

import React, { useMemo, useState } from "react";
import { Clock, MapPin, Plus, X } from "lucide-react";
import { events } from "@/data/events";

const TimelineCard = ({ selectedDate = new Date(), events = [] }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  const todayEvents = useMemo(() => {
    return events.filter(
      (e) =>
        new Date(e.date).toDateString() ===
        selectedDate.toDateString()
    );
  }, [events, selectedDate]);

  const colors = {
    meeting: "bg-orange-100 text-orange-700",
    design: "bg-zinc-100 text-zinc-700",
    study: "bg-blue-100 text-blue-700",
    presentation: "bg-amber-100 text-amber-700",
    report: "bg-emerald-100 text-emerald-700",
  };

//   const events = [
//     {
//       id: 1,
//       title: "Team Meetup",
//       day: "Mon",
//       startTime: "10:30",
//       endTime: "11:30",
//       position: {
//         top: "80px",
//         left: "120px",
//       },
//       type: "meeting",
//     },
//     {
//       id: 2,
//       title: "Illustration",
//       day: "Tue",
//       startTime: "12:30",
//       endTime: "13:30",
//       position: {
//         top: "170px",
//         left: "220px",
//       },
//       type: "design",
//     },
//     {
//       id: 3,
//       title: "Research",
//       day: "Wed",
//       startTime: "10:30",
//       endTime: "12:30",
//       position: {
//         top: "260px",
//         left: "90px",
//       },
//       type: "study",
//     },
//     {
//       id: 4,
//       title: "Presentation",
//       day: "Thu",
//       startTime: "13:30",
//       endTime: "14:30",
//       position: {
//         top: "350px",
//         left: "260px",
//       },
//       type: "presentation",
//     },
//     {
//       id: 5,
//       title: "Report",
//       day: "Sat",
//       startTime: "12:30",
//       endTime: "13:30",
//       position: {
//         top: "520px",
//         left: "190px",
//       },
//       type: "report",
//     },
//   ];

  return (

    <div className="w-full rounded-2xl bg-white p-4 sm:p-5 shadow-sm">

      {/* Header */}
      <div className="flex justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-zinc-900">
            Daily Schedule
          </h2>
          <p className="text-xs text-zinc-500">
            Clean timeline view
          </p>
        </div>

        <button className="h-9 w-9 rounded-xl bg-indigo-500 text-white flex items-center justify-center">
          <Plus size={16} />
        </button>
      </div>

      {/* Events */}
      <div className="space-y-2">
        {todayEvents.length === 0 ? (
          <p className="text-sm text-zinc-400">No events</p>
        ) : (
          todayEvents.map((event) => (
            <button
              key={event.id}
              onClick={() => setSelectedEvent(event)}
              className={`w-full p-3 rounded-xl text-left ${colors[event.type]} hover:scale-[1.01] transition`}
            >
              <div className="flex justify-between">
                <p className="font-medium">{event.title}</p>
                <span className="text-xs opacity-70">
                  {event.time}
                </span>
              </div>

              <div className="flex gap-2 text-xs mt-1 opacity-70">
                <Clock size={12} />
                <span>{event.time}</span>
                <MapPin size={12} />
                <span>{event.location}</span>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm p-5 rounded-2xl">
            <div className="flex justify-between">
              <h3 className="font-semibold">
                {selectedEvent.title}
              </h3>

              <button onClick={() => setSelectedEvent(null)}>
                <X size={18} />
              </button>
            </div>

            <p className="text-sm text-zinc-500 mt-2">
              {selectedEvent.time}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimelineCard;