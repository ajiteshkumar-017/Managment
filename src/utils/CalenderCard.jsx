"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CalendarCard = ({ selectedDate, onDateSelect }) => {
  const [currentWeekStart, setCurrentWeekStart] = React.useState(
    new Date(2026, 4, 18)
  );

  const getWeekDates = (date) => {
    const base = new Date(date);
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      return d;
    });
  };

  const weekDates = getWeekDates(currentWeekStart);

  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  const changeWeek = (dir) => {
    const d = new Date(currentWeekStart);
    d.setDate(d.getDate() + dir * 7);
    setCurrentWeekStart(d);
  };

  return (
    <div className="w-full rounded-2xl bg-white p-4 sm:p-5 shadow-sm">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-zinc-900">
            {currentWeekStart.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </h2>
          <p className="text-xs text-zinc-500">Weekly planner</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => changeWeek(-1)}
            className="h-8 w-8 rounded-xl bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center"
          >
            <ChevronLeft size={14}  className="text-black"/>
          </button>

          <button
            onClick={() => changeWeek(1)}
            className="h-8 w-8 rounded-xl bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center"
          >
            <ChevronRight size={14} className="text-black" />
          </button>
        </div>
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-2">
        {weekDates.map((date, i) => {
          const active =
            selectedDate?.toDateString() === date.toDateString();

          return (
            <button
              key={i}
              onClick={() => onDateSelect(date)}
              className={`
                rounded-xl py-1 px-5  flex flex-col items-center transition
                ${
                  active
                    ? "bg-indigo-500 text-white"
                    : "bg-zinc-50 hover:bg-zinc-100 text-zinc-700"
                }
              `}
            >
              <span className="text-[10px] opacity-80 ">
                {days[i]}
              </span>
              <span className="text-sm font-semibold">
                {date.getDate()}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarCard;