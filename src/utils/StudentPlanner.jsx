"use client";

import CalendarCard from "@/utils/CalenderCard";
import TimelineCard from "@/utils/TimelineCard";

import { useState } from "react";

const StudentPlanner = ({ events = [] }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="flex flex-col gap-5 w-full min-w-0">
      
      <CalendarCard
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
      />

      <TimelineCard
        events={events}
        selectedDate={selectedDate}
      />

    </div>
  );
};

export default StudentPlanner;