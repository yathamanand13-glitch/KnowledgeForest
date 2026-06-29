"use client";

import {
  ReactNode,
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

interface Props {
  children: ReactNode;
}

export default function AdminLayout({
  children,
}: Props) {

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

    const router = useRouter();

const [checkingAuth, setCheckingAuth] =
  useState(true);

  useEffect(() => {

  async function verifyAdmin() {

    // Check Supabase session
    const {
      data: { session },
    } =
      await supabase.auth.getSession();

    if (!session?.user) {

      router.replace("/admin/login");

      return;

    }

    // Verify this user exists in admins table
    const {
      data: admin,
    } =
      await supabase

        .from("admins")

        .select("id")

        .eq(
          "auth_user_id",
          session.user.id
        )

        .single();

    if (!admin) {

      await supabase.auth.signOut();

      router.replace("/admin/login");

      return;

    }

    setCheckingAuth(false);

  }

  verifyAdmin();

}, [router]);

    useEffect(() => {

  function handleResize() {

    if (window.innerWidth >= 1024) {

      setSidebarOpen(false);

    }

  }

  window.addEventListener(
    "resize",
    handleResize
  );

  return () =>
    window.removeEventListener(
      "resize",
      handleResize
    );

}, []);


useEffect(() => {

  if (sidebarOpen) {

    document.body.style.overflow = "hidden";

  } else {

    document.body.style.overflow = "auto";

  }

  return () => {

    document.body.style.overflow = "auto";

  };

}, [sidebarOpen]);

if (checkingAuth) {

  return (

    <div className="flex min-h-screen items-center justify-center bg-[#F5F7F2]">

      <div className="h-16 w-16 animate-spin rounded-full border-4 border-[#355E3B] border-t-transparent" />

    </div>

  );

}

  return (

    <div className="min-h-screen bg-[#F5F7F2]">

      <AdminSidebar
        open={sidebarOpen}
        onClose={() =>
          setSidebarOpen(false)
        }
      />

      <div className="lg:ml-[280px]">

        <AdminHeader
          onMenuClick={() =>
            setSidebarOpen(true)
          }
        />

        <main className="p-4 sm:p-6 lg:p-8">

          {children}

        </main>

      </div>

    </div>

  );

}