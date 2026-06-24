"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import AppLayout from "@/components/AppLayout";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleLogin() {

  const { data, error } = await supabase
    .from("admins")
    .select("*")
    .eq("email", email)
    .eq("password_hash", password)
    .single();

  if (error || !data) {

    alert("Invalid Email or Password");

    return;
  }

  localStorage.setItem(
    "admin",
    JSON.stringify(data)
  );

  router.push("/admin/dashboard");
}

  return (
  <AppLayout>
    <div className="flex min-h-[80vh] items-center justify-center px-4">

      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-lg">

        <h1 className="mb-2 text-center text-3xl font-bold text-[#355E3B]">
          Admin Login
        </h1>

        <p className="mb-8 text-center text-gray-500">
          Login to KnowledgeForest Admin Panel
        </p>

        <div className="space-y-5">

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full rounded-xl border p-4 outline-none focus:border-[#355E3B]"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full rounded-xl border p-4 outline-none focus:border-[#355E3B]"
          />

          <div className="flex items-center justify-between">

            <label className="flex items-center gap-2 text-sm">

              <input type="checkbox" />

              Remember Me

            </label>

            <button
              type="button"
              className="text-sm text-[#355E3B]"
            >
              Forgot Password?
            </button>

          </div>

          <button
            onClick={handleLogin}
            className="w-full rounded-xl bg-[#355E3B] py-4 font-medium text-white transition hover:bg-[#2c4c31]"
          >
            Login
          </button>

        </div>

      </div>

    </div>
  </AppLayout>
);
}