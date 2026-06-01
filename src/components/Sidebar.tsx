"use client";

import Link from "next/link";

import {
  X,
  House,
  Building2,
  BookOpen,
  FileText,
  GraduationCap,
  TrendingUp,
  LogIn,
  LayoutDashboard,
  Bookmark,
  Upload,
  Settings,
} from "lucide-react";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (value: boolean) => void;
}

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
}: SidebarProps) {
  return (
    <>
      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
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
          <h2 className="text-3xl font-bold text-[#355E3B]">
            KnowledgeForest
          </h2>

          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 transition hover:bg-gray-100"
          >
            <X className="h-6 w-6 text-[#1E293B]" />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex flex-col gap-2 p-4">
          {[
            { icon: House, label: "Home", href: "/" },

            {
              icon: Building2,
              label: "Colleges",
              href: "/colleges",
            },

            {
              icon: BookOpen,
              label: "Subjects",
              href: "/subjects",
            },

            {
              icon: FileText,
              label: "Resources",
              href: "/resources",
            },

            {
              icon: GraduationCap,
              label: "Faculty",
              href: "/faculty",
            },

            {
              icon: TrendingUp,
              label: "Trending",
              href: "/trending",
            },

            {
              icon: LogIn,
              label: "Faculty Login",
              href: "/login",
            },

          ].map((item, index) => (
            <Link
              key={index}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-4 rounded-xl px-4 py-3 transition hover:bg-[#E7F0E8]"
            >
              <item.icon className="h-5 w-5 text-[#355E3B]" />

              <span className="text-[16px] font-medium text-[#1E293B]">
                {item.label}
              </span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}