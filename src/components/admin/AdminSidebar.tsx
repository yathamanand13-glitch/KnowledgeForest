"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

import {
  LayoutDashboard,
  Building2,
  BookOpen,
  GraduationCap,
  FileText,
  BarChart3,
  LogOut,
  Bell,
} from "lucide-react";

interface Props {

  open: boolean;

  onClose: () => void;

}

export default function AdminSidebar({
  open,
  onClose,
}: Props) {
  const pathname = usePathname();

  const router = useRouter();

  const menu = [
    {
      label: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
  label: "Notifications",
  href: "/admin/notifications",
  icon: Bell,
},
    {
      label: "Colleges",
      href: "/admin/colleges",
      icon: Building2,
    },
    {
      label: "Subjects",
      href: "/admin/subjects",
      icon: BookOpen,
    },
    {
      label: "Faculties",
      href: "/admin/faculties",
      icon: GraduationCap,
    },
    {
      label: "Resources",
      href: "/admin/resources",
      icon: FileText,
    },
    {
      label: "Analytics",
      href: "/admin/analytics",
      icon: BarChart3,
    },
  ];

  async function handleLogout() {

  const confirmed = window.confirm(
    "Are you sure you want to logout?"
  );

  if (!confirmed) return;

  // Remove local admin session
  localStorage.removeItem("admin");

  // Sign out Supabase (safe even if admin doesn't use Supabase Auth)
  await supabase.auth.signOut();

  // Redirect to admin login
  router.replace("/admin/login");

}

  return (
    <>

{open && (

<div
  onClick={onClose}
  className="fixed inset-0 z-40 bg-black/40 lg:hidden"
/>

)}

<aside
  className={`fixed left-0 top-0 z-50 h-screen w-[280px] border-r bg-white shadow-xl transition-transform duration-300

  ${
    open
      ? "translate-x-0"
      : "-translate-x-full"
  }

  lg:translate-x-0`}
>

      <div className="border-b p-6">

        <h1 className="text-3xl font-bold text-[#355E3B]">
          KF Admin
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          KnowledgeForest
        </p>

      </div>

      <nav className="flex flex-col gap-2 p-4">

        {menu.map((item) => {

          const active =
            pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-4 rounded-xl px-4 py-3 transition ${
                active
                  ? "bg-[#355E3B] text-white"
                  : "hover:bg-[#E7F0E8]"
              }`}
            >
              <item.icon size={20} />

              <span className="font-medium">
                {item.label}
              </span>

            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-0 w-full border-t p-4">

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-red-600 transition hover:bg-red-50"
        >
          <LogOut size={20} />

          Logout
        </button>

      </div>

    </aside>
    </>
  );
}