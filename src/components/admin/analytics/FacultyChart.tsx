"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface Props {
  data: any[];
}

export default function FacultyChart({
  data,
}: Props) {
  return (

    <div className="rounded-2xl bg-white p-6 shadow">

      <h2 className="mb-6 text-xl font-bold">

        Top Faculty Uploaders

      </h2>

      <div className="h-80">

        <ResponsiveContainer>

          <BarChart data={data}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="faculty" />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="uploads"
              fill="#355E3B"
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>

  );
}