"use client";

import { useEffect, useState } from "react";

import AdminLayout from "@/components/admin/AdminLayout";

import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {

  const [stats, setStats] = useState({
    colleges: 0,
    subjects: 0,
    faculties: 0,
    resources: 0,
  });

  const [
  notificationCount,
  setNotificationCount
] = useState(0);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {

    const [
      colleges,
      subjects,
      faculties,
      resources,
    ] = await Promise.all([

      supabase
        .from("colleges")
        .select("*", {
          count: "exact",
          head: true,
        }),

      supabase
        .from("subjects")
        .select("*", {
          count: "exact",
          head: true,
        }),

      supabase
        .from("faculties")
        .select("*", {
          count: "exact",
          head: true,
        }),

      supabase
        .from("resources")
        .select("*", {
          count: "exact",
          head: true,
        }),
    ]);

    const {
  count:
    unreadNotifications
} =
  await supabase
    .from(
      "admin_notifications"
    )
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq(
      "is_read",
      false
    );

    setStats({
      colleges: colleges.count || 0,
      subjects: subjects.count || 0,
      faculties: faculties.count || 0,
      resources: resources.count || 0,
    });

    setNotificationCount(
  unreadNotifications || 0
);
  }

  return (

        <AdminLayout>


    <div className="space-y-10">

      <h1 className="mb-8 text-4xl font-bold text-[#355E3B]">
        Admin Dashboard
      </h1>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">

        <div className="rounded-3xl bg-white p-6 shadow">
          <p className="text-gray-500">
            Colleges
          </p>

          <h2 className="mt-3 text-4xl font-bold text-[#355E3B]">
            {stats.colleges}
          </h2>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow">
          <p className="text-gray-500">
            Subjects
          </p>

          <h2 className="mt-3 text-4xl font-bold text-[#355E3B]">
            {stats.subjects}
          </h2>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow">
          <p className="text-gray-500">
            Faculties
          </p>

          <h2 className="mt-3 text-4xl font-bold text-[#355E3B]">
            {stats.faculties}
          </h2>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow">
          <p className="text-gray-500">
            Resources
          </p>

          <h2 className="mt-3 text-4xl font-bold text-[#355E3B]">
            {stats.resources}
          </h2>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow">

  <p className="text-gray-500">
    Notifications
  </p>

  <h2 className="mt-3 text-4xl font-bold text-orange-500">
    {notificationCount}
  </h2>

</div>


      </div>
      <div className="mt-10">

  <h2 className="mb-5 text-2xl font-bold text-[#355E3B]">
    Quick Actions
  </h2>

  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

    <a
      href="/admin/colleges"
      className="rounded-2xl bg-[#355E3B] p-6 text-white shadow transition hover:scale-105"
    >
      <h3 className="text-xl font-semibold">
        Add College
      </h3>

      <p className="mt-2 text-sm text-white/80">
        Manage colleges
      </p>
    </a>

    <a
      href="/admin/subjects"
      className="rounded-2xl bg-[#355E3B] p-6 text-white shadow transition hover:scale-105"
    >
      <h3 className="text-xl font-semibold">
        Add Subject
      </h3>

      <p className="mt-2 text-sm text-white/80">
        Manage subjects
      </p>
    </a>

    <a
      href="/admin/faculties"
      className="rounded-2xl bg-[#355E3B] p-6 text-white shadow transition hover:scale-105"
    >
      <h3 className="text-xl font-semibold">
        Add Faculty
      </h3>

      <p className="mt-2 text-sm text-white/80">
        Manage faculty accounts
      </p>
    </a>

    <a
      href="/admin/resources"
      className="rounded-2xl bg-[#355E3B] p-6 text-white shadow transition hover:scale-105"
    >
      <h3 className="text-xl font-semibold">
        Manage Resources
      </h3>

      <p className="mt-2 text-sm text-white/80">
        Review uploaded resources
      </p>
    </a>

    <a
href="/admin/notifications"
className="rounded-2xl bg-orange-500 p-6 text-white shadow transition hover:scale-105"

>

  <h3 className="text-xl font-semibold">
    Notifications
  </h3>

  <p className="mt-2 text-sm text-white/80">
    Review approval requests
  </p>

</a>


  </div>

</div>

    </div>
     </AdminLayout>
  );
}