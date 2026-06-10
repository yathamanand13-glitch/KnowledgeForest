"use client";

import { useState } from "react";

import { supabase } from "@/lib/supabase";

import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {

  const router = useRouter();

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword
  ] = useState("");

  const [loading, setLoading] =
    useState(false);

  const handleReset =
    async () => {

      if (
        password.length < 6
      ) {

        alert(
          "Password must be at least 6 characters"
        );

        return;
      }

      if (
        password !==
        confirmPassword
      ) {

        alert(
          "Passwords do not match"
        );

        return;
      }

      setLoading(true);

      const { error } =
        await supabase.auth.updateUser({

          password,

        });

      setLoading(false);

      if (error) {

        alert(error.message);

        return;
      }

      alert(
        "Password updated successfully"
      );

      router.replace("/login");
    };

  return (

    <div className="flex min-h-screen items-center justify-center bg-[#F8FAF5] p-6">

      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">

        <h1 className="text-center text-3xl font-bold">

          Reset Password

        </h1>

        <p className="mt-3 text-center text-gray-500">

          Enter your new password

        </p>

        <div className="mt-8 space-y-5">

          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            className="w-full rounded-xl border p-4"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(
                e.target.value
              )
            }
            className="w-full rounded-xl border p-4"
          />

          <button
            onClick={
              handleReset
            }
            disabled={loading}
            className="w-full rounded-xl bg-[#355E3B] py-4 font-semibold text-white"
          >

            {loading
              ? "Updating..."
              : "Update Password"}

          </button>

        </div>

      </div>

    </div>
  );
}