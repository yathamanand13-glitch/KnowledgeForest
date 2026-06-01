"use client";

import Link from "next/link";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

import {
  LayoutDashboard,
  Upload,
  FileText,
  Bookmark,
  Settings,
  LogOut,
  GraduationCap,
  X,
} from "lucide-react";

interface FacultySidebarProps {
  sidebarOpen: boolean;

  setSidebarOpen: (
    value: boolean
  ) => void;
}

export default function FacultySidebar({
  sidebarOpen,
  setSidebarOpen,
}: FacultySidebarProps) {

  const router = useRouter();

  const [faculty, setFaculty] =
    useState<any>(null);

  useEffect(() => {

    const fetchFaculty =
      async () => {

        const {
          data: { user },
        } =
          await supabase.auth.getUser();

        if (!user) {

          router.push("/login");

          return;
        }

        const { data, error } =
          await supabase

            .from("faculties")

            .select("*")

            .eq(
              "email",
              user.email
            )

            .single();

        if (error) {

          console.log(error);

          return;
        }

        setFaculty(data);
      };

    fetchFaculty();

    const channel =
  supabase

    .channel("faculty-changes")

    .on(
      "postgres_changes",
      {
        event: "UPDATE",

        schema: "public",

        table: "faculties",
      },

      (payload) => {

        if (
          payload.new.email ===
          faculty?.email
        ) {

          setFaculty(
            payload.new
          );
        }
      }
    )

    .subscribe();

    const {
  data: authListener,
} =
  supabase.auth.onAuthStateChange(
    (
      event,
      session
    ) => {

      if (!session) {

        router.push("/login");
      }
    }
  );

return () => {

  authListener.subscription.unsubscribe();

  supabase.removeChannel(channel);
};

  }, [router, faculty]);

  const handleLogout =
    async () => {

      await supabase.auth.signOut();

      setSidebarOpen(false);

      router.push("/login");
    };

  const menuItems = [

    {
      icon: LayoutDashboard,

      label: "Dashboard",

      href: "/dashboard",
    },

    {
      icon: Upload,

      label: "Upload Resource",

      href: "/upload",
    },

    {
      icon: FileText,

      label: "Manage Uploads",

      href: "/manage-uploads",
    },

    {
      icon: Bookmark,

      label: "Bookmarks",

      href: "/bookmarks",
    },

    {
      icon: Settings,

      label: "Settings",

      href: "/settings",
    },
  ];

  return (
    <>
      {/* Overlay */}
      {sidebarOpen && (

        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"

          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-[280px] overflow-y-auto bg-white shadow-2xl transition-transform duration-300 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-5">

          <div>

            <h2 className="text-2xl font-bold text-[#355E3B]">
              Faculty Panel
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              KnowledgeForest
            </p>

          </div>

          <button
            onClick={() =>
              setSidebarOpen(false)
            }

            className="rounded-lg p-2 transition hover:bg-gray-100"
          >

            <X className="h-6 w-6 text-[#1E293B]" />

          </button>
        </div>

        {/* Faculty Profile */}
        <div className="flex flex-col items-center border-b border-gray-100 p-6 text-center">

          {
            faculty?.profile_photo_url ?

             <img
  src={
    faculty.profile_photo_url
  }

  alt="Profile"

  onError={(e) => {

    (
      e.target as HTMLImageElement
    ).src =
      "/default-profile.png";
  }}

  className="h-24 w-24 rounded-full object-cover shadow-lg"
/>

            :

              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#355E3B] text-white shadow-lg">

                <GraduationCap size={44} />

              </div>
          }

          <h3 className="mt-5 text-xl font-bold text-[#1F2937]">

            {
              faculty?.faculty_name
              ||
              "Faculty"
            }

          </h3>

          <p className="mt-2 text-sm text-gray-500">

            {
              faculty?.department
              ||
              "Department"
            }

          </p>

          {/* Verified Badge */}
          {
            faculty?.is_verified && (

              <div className="mt-3 rounded-full bg-green-100 px-4 py-1 text-sm font-medium text-green-700">

                ✅ Verified Faculty

              </div>
            )
          }
        </div>

        {/* Menu */}
        <nav className="flex flex-col gap-2 p-4">

          {
            menuItems.map(
              (
                item,
                index
              ) => (

                <Link
                  key={index}

                  href={item.href}

                  onClick={() =>
                    setSidebarOpen(false)
                  }

                  className="flex items-center gap-4 rounded-xl px-4 py-4 transition hover:bg-[#E7F0E8]"
                >

                  <item.icon
                    className="text-[#355E3B]"
                    size={22}
                  />

                  <span className="font-medium text-[#1F2937]">

                    {item.label}

                  </span>

                </Link>
              )
            )
          }
        </nav>

        {/* Faculty Stats */}
        <div className="px-5 py-4">

          <div className="rounded-2xl bg-[#F7FAF4] p-4">

            <h4 className="mb-4 text-sm font-semibold text-gray-600">
              Faculty Stats
            </h4>

            <div className="space-y-3">

              <div className="flex items-center justify-between">

                <span className="text-gray-500">
                  Uploads
                </span>

                <span className="font-bold text-[#355E3B]">

                  {
                    faculty?.uploads_count
                    || 0
                  }

                </span>
              </div>

              <div className="flex items-center justify-between">

  <span className="text-gray-500">
    Rating
  </span>

  <span className="font-bold text-yellow-500">

    ⭐ {
      faculty?.rating
      || 0
    }

  </span>
</div>

              <div className="flex items-center justify-between">

                <span className="text-gray-500">
                  Experience
                </span>

                <span className="font-bold text-[#355E3B]">

                 {
  faculty?.experience
  || "0 Years"
}

                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Logout */}
        <div className="p-4">

          <button
            onClick={handleLogout}

            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-red-500 px-6 py-4 text-lg font-semibold text-white transition hover:bg-red-600"
          >

            <LogOut size={22} />

            Logout

          </button>
        </div>
      </aside>
    </>
  );
}