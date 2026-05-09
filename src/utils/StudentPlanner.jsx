"use client";

import { Epg, Layout, useEpg } from "planby";
import { dates } from "@/data/dates";
import { channels } from "@/data/channel";
import { events } from "@/data/events";

const StudentPlanner = () => {
  const { getEpgProps, getLayoutProps } = useEpg({
  channels,
  epg: events,
  startDate: "2026-05-09T08:00:00",
  endDate: "2026-05-09T18:00:00",

  width: 320,
  height: 450,
  sidebarWidth: 80,
  itemHeight: 60,
  dayWidth: 500,
});

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 max-w-2xs">

      {/* Date strip */}
      <div className="flex gap-4 overflow-x-auto mb-8">
        {dates.map((date) => (
          <button
            key={date.id}
            className={`
              min-w-[72px]
              h-[88px]
              rounded-2xl
              border
              flex
              flex-col
              items-center
              justify-center
              transition-all
              ${
                date.active
                  ? "bg-indigo-500 text-white border-indigo-500"
                  : "bg-white border-gray-200 text-gray-700"
              }
            `}
          >
            <span className="text-sm font-medium">
              {date.day}
            </span>

            <span className="text-xl font-bold">
              {date.date}
            </span>
          </button>
        ))}
      </div>

      {/* Timeline wrapper */}
      <div className="min-w-2xs w-full overflow-x-auto">
  <Epg {...getEpgProps()}>
    <Layout {...getLayoutProps()} />
  </Epg>
</div>
    </div>
  );
};

export default StudentPlanner;