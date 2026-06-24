"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

export default function AdminNotificationsPage() {

  const [
    notifications,
    setNotifications
  ] = useState<Notification[]>([]);

  const [
    loading,
    setLoading
  ] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {

    setLoading(true);

    const { data } =
      await supabase
        .from(
          "admin_notifications"
        )
        .select("*")
        .order(
          "created_at",
          {
            ascending: false,
          }
        );

    if (data) {
      setNotifications(data);
    }

    setLoading(false);
  }

  async function markAsRead(
    id: string
  ) {

    await supabase
      .from(
        "admin_notifications"
      )
      .update({
        is_read: true,
      })
      .eq("id", id);

    loadNotifications();
  }

  return (

    <div>

      <h1 className="mb-8 text-4xl font-bold text-[#355E3B]">
        Notifications
      </h1>

      <div className="space-y-4">

        {loading ? (

          <div>
            Loading...
          </div>

        ) : notifications.length === 0 ? (

          <div className="rounded-3xl bg-white p-10 text-center shadow">

            No notifications found.

          </div>

        ) : (

          notifications.map(
            (notification) => (

              <div
                key={
                  notification.id
                }
                className={`rounded-3xl p-6 shadow ${
                  notification.is_read
                    ? "bg-white"
                    : "border-l-4 border-orange-500 bg-orange-50"
                }`}
              >

                <div className="flex items-start justify-between">

                  <div>

                    <h2 className="text-xl font-semibold">

                      {
                        notification.title
                      }

                    </h2>

                    <p className="mt-2 text-gray-600">

                      {
                        notification.message
                      }

                    </p>

                  </div>

                  {!notification.is_read && (

                    <button
                      onClick={() =>
                        markAsRead(
                          notification.id
                        )
                      }
                      className="rounded-xl bg-[#355E3B] px-4 py-2 text-white"
                    >
                      Mark Read
                    </button>

                  )}

                </div>

              </div>

            )
          )

        )}

      </div>

    </div>
  );
}