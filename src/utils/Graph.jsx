    // const activeHours = [
    //   { day: "S", hours: 2 },
    //   { day: "M", hours: 5 },
    //   { day: "T", hours: 3 },
    //   { day: "W", hours: 4 },
    //   { day: "T", hours: 7 },
    //   { day: "F", hours: 3 },
    //   { day: "S", hours: 3 },
    // ];

    // const performance = [
    //   { month: "Jan", score: 20 },
    //   { month: "Feb", score: 40 },
    //   { month: "Mar", score: 35 },
    //   { month: "Apr", score: 45 },
    //   { month: "May", score: 60 },
    //   { month: "Jun", score: 55 },
    // ];

"use client";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

 

export default function AnalyticsSection() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">

      {/* Left Card */}
      <div className="xl:col-span-2 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-black">
            Learning Hours
          </h2>

          <select className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 outline-none">
            <option>Weekly</option>
            <option>Monthly</option>
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* Chart */}
          

          {/* Stats */}
          <div className="space-y-8 flex flex-col justify-center">

            <div>
              <p className="text-sm text-gray-500">
                Time Spent
              </p>

              <div className="flex items-center gap-3 mt-2">
                <h3 className="text-3xl font-bold text-black">
                  28h
                </h3>

                <span className="px-3 py-1 rounded-full bg-green-100 text-green-600 text-sm font-medium">
                  85%
                </span>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Lessons Taken
              </p>

              <div className="flex items-center gap-3 mt-2">
                <h3 className="text-3xl font-bold text-black">
                  60
                </h3>

                <span className="px-3 py-1 rounded-full bg-green-100 text-green-600 text-sm font-medium">
                  79%
                </span>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Exams Passed
              </p>

              <div className="flex items-center gap-3 mt-2">
                <h3 className="text-3xl font-bold text-black">
                  10
                </h3>

                <span className="px-3 py-1 rounded-full bg-green-100 text-green-600 text-sm font-medium">
                  100%
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Right Card */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">

        {/* Header */}
        <h2 className="text-2xl font-bold text-black mb-8">
          Performance
        </h2>

        {/* Line Chart */}
        <div className="h-62.5">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />

              <Line
                type="monotone"
                dataKey="score"
                strokeWidth={3}
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bottom Summary */}
        <div className="mt-8 flex gap-4 items-start">

          <h3 className="text-4xl font-bold text-black">
            40%
          </h3>

          <p className="text-gray-500 leading-7">
            Your productivity is 40% higher compared
            to last month
          </p>

        </div>
      </div>

    </div>
  );
}