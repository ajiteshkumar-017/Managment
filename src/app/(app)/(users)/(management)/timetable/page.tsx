"use client"
import AdminNavbar from '@/utils/AdminNavbar'
import { Bell, Download, Search } from 'lucide-react'
import React,{useEffect, useState} from 'react'
import {jsPDF} from "jspdf"

function Timetable() {
  const [username, setUsername] = useState('')
  const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

const timeSlots = [
  "09:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:15 AM - 12:15 PM",
  "02:00 PM - 03:00 PM",
];

const timetableData = [
  // Monday
  {
    day: "Monday",
    subject: "Database Management Systems",
    faculty: "Dr. Smith",
    room: "A-101",
    time: "09:00 AM - 10:00 AM",
  },
  {
    day: "Monday",
    subject: "Computer Networks",
    faculty: "Prof. Davis",
    room: "B-204",
    time: "10:00 AM - 11:00 AM",
  },
  {
    day: "Monday",
    subject: "Operating Systems",
    faculty: "Dr. Johnson",
    room: "C-302",
    time: "11:15 AM - 12:15 PM",
  },
  {
    day: "Monday",
    subject: "Software Engineering",
    faculty: "Prof. Wilson",
    room: "A-203",
    time: "02:00 PM - 03:00 PM",
  },

  // Tuesday
  {
    day: "Tuesday",
    subject: "Data Structures",
    faculty: "Prof. Brown",
    room: "A-102",
    time: "09:00 AM - 10:00 AM",
  },
  {
    day: "Tuesday",
    subject: "Web Technologies",
    faculty: "Dr. Taylor",
    room: "B-205",
    time: "10:00 AM - 11:00 AM",
  },
  {
    day: "Tuesday",
    subject: "Artificial Intelligence",
    faculty: "Dr. Anderson",
    room: "C-303",
    time: "11:15 AM - 12:15 PM",
  },
  {
    day: "Tuesday",
    subject: "Cloud Computing",
    faculty: "Prof. Harris",
    room: "A-104",
    time: "02:00 PM - 03:00 PM",
  },

  // Wednesday
  {
    day: "Wednesday",
    subject: "Machine Learning",
    faculty: "Dr. Thomas",
    room: "B-206",
    time: "09:00 AM - 10:00 AM",
  },
  {
    day: "Wednesday",
    subject: "Cyber Security",
    faculty: "Prof. White",
    room: "A-105",
    time: "10:00 AM - 11:00 AM",
  },
  {
    day: "Wednesday",
    subject: "Computer Networks Lab",
    faculty: "Dr. Martinez",
    room: "Lab-1",
    time: "11:15 AM - 01:15 PM",
  },
  {
    day: "Wednesday",
    subject: "Professional Communication",
    faculty: "Prof. Clark",
    room: "B-108",
    time: "02:00 PM - 03:00 PM",
  },

  // Thursday
  {
    day: "Thursday",
    subject: "Database Management Systems Lab",
    faculty: "Dr. Smith",
    room: "Lab-2",
    time: "09:00 AM - 11:00 AM",
  },
  {
    day: "Thursday",
    subject: "Software Engineering",
    faculty: "Prof. Wilson",
    room: "A-203",
    time: "11:15 AM - 12:15 PM",
  },
  {
    day: "Thursday",
    subject: "Project Management",
    faculty: "Dr. Green",
    room: "C-201",
    time: "02:00 PM - 03:00 PM",
  },
  {
    day: "Thursday",
    subject: "Entrepreneurship",
    faculty: "Prof. Adams",
    room: "B-110",
    time: "03:00 PM - 04:00 PM",
  },

  // Friday
  {
    day: "Friday",
    subject: "Data Analytics",
    faculty: "Dr. Lewis",
    room: "A-107",
    time: "09:00 AM - 10:00 AM",
  },
  {
    day: "Friday",
    subject: "Machine Learning",
    faculty: "Dr. Thomas",
    room: "B-206",
    time: "10:00 AM - 11:00 AM",
  },
  {
    day: "Friday",
    subject: "Major Project",
    faculty: "Prof. Walker",
    room: "Project Hall",
    time: "11:15 AM - 01:15 PM",
  },
  {
    day: "Friday",
    subject: "Seminar",
    faculty: "Dr. King",
    room: "Seminar Hall",
    time: "02:00 PM - 03:00 PM",
  },

  // Saturday
  {
    day: "Saturday",
    subject: "Industry Training",
    faculty: "Guest Faculty",
    room: "Auditorium",
    time: "09:00 AM - 11:00 AM",
  },
  {
    day: "Saturday",
    subject: "Coding Practice",
    faculty: "Prof. Scott",
    room: "Lab-3",
    time: "11:15 AM - 01:15 PM",
  },
];

const downloadTimetable = () => {
  const doc = new jsPDF({
    orientation: "landscape",
  });

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const timeSlots = [
    "09:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:15 AM - 12:15 PM",
    "02:00 PM - 03:00 PM",
    "03:00 PM - 04:00 PM",
  ];

  const timetableMap = {};

  timetableData.forEach((item) => {
    if (!timetableMap[item.day]) {
      timetableMap[item.day] = {};
    }

    timetableMap[item.day][item.time] = item;
  });

  const head = [
    ["Day", ...timeSlots],
  ];

  const body = days.map((day) => [
    day,
    ...timeSlots.map((slot) => {
      const cls = timetableMap[day]?.[slot];

      return cls
        ? `${cls.subject}\n${cls.faculty}\n${cls.room}`
        : "-";
    }),
  ]);

  doc.setFontSize(18);
  doc.text("Class Timetable", 14, 20);

  // autoTable(doc, {
  //   head,
  //   body,
  //   startY: 30,
  //   theme: "grid",
  //   styles: {
  //     fontSize: 8,
  //     cellPadding: 3,
  //     valign: "middle",
  //   },
  //   headStyles: {
  //     fillColor: [41, 128, 185],
  //   },
  // });

  doc.save("timetable.pdf");
};



const timetableMap = [];

timetableData.forEach((item) => {
  if (!timetableMap[item.day]) {
    timetableMap[item.day] = {};
  }

  timetableMap[item.day][item.time] = item;
});
  return (
    <div className="bg-linear-to-br from-slate-50 via-white to-slate-50 min-h-screen p-3 sm:p-4 md:p-5 lg:p-6">
          {/* MAIN LAYOUT */}
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-5 md:gap-6">
    
            {/* Fixed the navbar width in small screen --> reomoved items-start from above div. That was the culprit */}
    
              <AdminNavbar/ >
    
            {/* ================= MAIN CONTENT ================= */}
            <div
              className={`
                bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-7 lg:p-8 shadow-sm
                transition-all duration-300
                w-full
                text-slate-900
                
              `}
            >
              {/* HEADER */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 pb-6 sm:pb-8 border-b border-slate-200">
                {/* Greeting */}
                <div className="min-w-0">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">
                    Hello {username} 👋
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 sm:mt-2">
                    Let's learn something new today
                  </p>
                </div>
    
                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 shrink-0">
                  {/* Search */}
                  <div className="relative w-full sm:w-auto flex-1 sm:flex-none">
                    <Search 
                      className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400" 
                      size={18}
                    />
                    <input
                      className="w-full sm:w-52 md:w-60 lg:w-64 pl-10 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-slate-200 rounded-lg sm:rounded-xl text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="Search..."
                    />
                  </div>
    
                  {/* Notification Button */}
                  <button className="p-2.5 sm:p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg sm:rounded-xl transition-all shrink-0 flex items-center justify-center">
                    <Bell size={18} />
                  </button>
    
                  
                  
                </div>
              </div>

              <div className='mt-6 sm:mt-8 md:mt-10 lg:mt-12 p-4'>
                <div className='flex justify-between items-center mb-4'>
                  <h3 className="text-lg sm:text-xl  font-semibold text-slate-900">
                    Class Timetable
                  </h3>

                  <button className=' m-4 py-3 px-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg sm:rounded-xl transition-all shrink-0 flex items-center justify-between gap-2 hover:scale-95 duration-300 cursor-pointer'>
                    <Download />
                    <p className="text-sm font-bold tracking-wider">Download Timetable</p>
                  </button>
                </div>
                <div className="overflow-x-auto rounded-2xl shadow-lg">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="border p-4">Day</th>

                        {timeSlots.map((slot) => (
                          <th key={slot} className="border p-4">
                            {slot}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {days.map((day) => (
                        <tr key={day}>
                          <td className="border p-4 font-semibold bg-slate-50">
                            {day}
                          </td>

                          {timeSlots.map((slot) => {
                            const classData =
                              timetableMap[day]?.[slot];

                            return (
                              <td
                                key={slot}
                                className="border p-3 text-center"
                              >
                                {classData ? (
                                  <div>
                                    <p className="font-semibold">
                                      {classData.subject}
                                    </p>

                                    <div className='flex justify-between items-center mt-1'>
                                      <p className="text-sm text-slate-500">
                                      {classData.faculty}
                                    </p>

                                    <p className="text-xs text-slate-400">
                                      {classData.room}
                                    </p>
                                    </div>
                                  </div>
                                ) : (
                                  "-"
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              </div>
              </div>
              
    </div>
  )
}

export default Timetable
