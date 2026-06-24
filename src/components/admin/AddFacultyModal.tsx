"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface AddFacultyModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  faculty?: any;
}

export default function AddFacultyModal({
  open,
  onClose,
  onSuccess,
  faculty,
}: AddFacultyModalProps) {
  const [facultyName, setFacultyName] =
    useState("");

  const [facultyId, setFacultyId] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [department, setDepartment] =
    useState("");

  const [designation, setDesignation] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [saving, setSaving] =
    useState(false);

   useEffect(() => {

  if (faculty) {

    setFacultyName(
      faculty.faculty_name || ""
    );

    setFacultyId(
      faculty.faculty_id || ""
    );

    setEmail(
      faculty.email || ""
    );

    setDepartment(
      faculty.department || ""
    );

    setDesignation(
      faculty.designation || ""
    );

  } else {

    setFacultyName("");
    setFacultyId("");
    setEmail("");
    setDepartment("");
    setDesignation("");
    setPassword("");

  }

}, [faculty]);

 async function handleSave() {

  if (
    !facultyName ||
    !facultyId ||
    !email
  ) {
    alert(
      "Please fill required fields"
    );
    return;
  }

  setSaving(true);

  try {

    if (faculty) {

      const { error } =
        await supabase
          .from("faculties")
          .update({
            faculty_name:
              facultyName,

            faculty_id:
              facultyId,

            email,

            department,

            designation,
          })
          .eq(
            "id",
            faculty.id
          );

      if (error) {
        alert(error.message);
        return;
      }

    } else {

      const { error } =
        await supabase
          .from("faculties")
          .insert([
            {
              faculty_name:
                facultyName,

              faculty_id:
                facultyId,

              email,

              department,

              designation,

              password_hash:
                password,

              status: "inactive",

              approval_status:
                "pending",

              uploads_count: 0,
            },
          ]);

      if (error) {
        alert(error.message);
        return;
      }
    }

    onSuccess();
    onClose();
    setFacultyName("");
setFacultyId("");
setEmail("");
setDepartment("");
setDesignation("");
setPassword("");

  } finally {

    setSaving(false);

  }
}

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      <div className="w-[95%] max-w-2xl rounded-3xl bg-white p-8 shadow-2xl">

        <div className="mb-6 flex items-center justify-between">

          <h2 className="text-2xl font-bold text-[#355E3B]">
            {faculty
  ? "Edit Faculty"
  : "Add Faculty"}
          </h2>

          <button
            onClick={onClose}
            className="text-2xl text-gray-500"
          >
            ×
          </button>

        </div>

        <div className="grid gap-4 md:grid-cols-2">

          <input
            type="text"
            placeholder="Faculty Name"
            value={facultyName}
            onChange={(e) =>
              setFacultyName(
                e.target.value
              )
            }
            className="rounded-xl border p-3"
          />

          <input
            type="text"
            placeholder="Faculty ID"
            value={facultyId}
            onChange={(e) =>
              setFacultyId(
                e.target.value
              )
            }
            className="rounded-xl border p-3"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            className="rounded-xl border p-3"
          />

          <input
            type="text"
            placeholder="Department"
            value={department}
            onChange={(e) =>
              setDepartment(
                e.target.value
              )
            }
            className="rounded-xl border p-3"
          />

          <input
            type="text"
            placeholder="Designation"
            value={designation}
            onChange={(e) =>
              setDesignation(
                e.target.value
              )
            }
            className="rounded-xl border p-3"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            className="rounded-xl border p-3"
          />

        </div>

        <div className="mt-8 flex justify-end gap-3">

          <button
            onClick={onClose}
            className="rounded-xl border px-5 py-3"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-xl bg-[#355E3B] px-5 py-3 text-white"
          >
            {saving
  ? "Saving..."
  : faculty
  ? "Update Faculty"
  : "Save Faculty"}
          </button>

        </div>

      </div>

    </div>
  );
}