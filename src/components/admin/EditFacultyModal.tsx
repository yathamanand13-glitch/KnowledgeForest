"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Props {
  open: boolean;
  faculty: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditFacultyModal({
  open,
  faculty,
  onClose,
  onSuccess,
}: Props) {

  const [form, setForm] = useState({
    faculty_name: "",
    faculty_id: "",
    email: "",
    department: "",
    designation: "",
  });

  useEffect(() => {

    if (faculty) {

      setForm({
        faculty_name:
          faculty.faculty_name || "",

        faculty_id:
          faculty.faculty_id || "",

        email:
          faculty.email || "",

        department:
          faculty.department || "",

        designation:
          faculty.designation || "",
      });
    }

  }, [faculty]);

  async function updateFaculty() {

    const { error } =
      await supabase
        .from("faculties")
        .update({
          faculty_name:
            form.faculty_name,

          faculty_id:
            form.faculty_id,

          email:
            form.email,

          department:
            form.department,

          designation:
            form.designation,
        })
        .eq("id", faculty.id);

    if (!error) {

      onSuccess();

      onClose();
    }
  }

  if (!open || !faculty)
    return null;

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      <div className="w-[95%] max-w-2xl rounded-3xl bg-white p-8">

        <h2 className="mb-6 text-2xl font-bold">
          Edit Faculty
        </h2>

        <div className="grid gap-4">

          <div>
  <label className="mb-1 block text-sm font-medium text-gray-600">
    Faculty Name
  </label>

  <input
    placeholder="Enter Faculty Name"
    value={form.faculty_name}
    onChange={(e) =>
      setForm({
        ...form,
        faculty_name: e.target.value,
      })
    }
    className="w-full rounded-xl border p-3 placeholder:text-gray-400"
  />
</div>

          <div>
  <label className="mb-1 block text-sm font-medium text-gray-600">
    Faculty ID
  </label>

  <input
    placeholder="Enter Faculty ID"
    value={form.faculty_id}
    onChange={(e) =>
      setForm({
        ...form,
        faculty_id: e.target.value,
      })
    }
    className="w-full rounded-xl border p-3 placeholder:text-gray-400"
  />
</div>

         <div>
  <label className="mb-1 block text-sm font-medium text-gray-600">
    Email
  </label>

  <input
    placeholder="Enter Email Address"
    value={form.email}
    onChange={(e) =>
      setForm({
        ...form,
        email: e.target.value,
      })
    }
    className="w-full rounded-xl border p-3 placeholder:text-gray-400"
  />
</div>

         <div>
  <label className="mb-1 block text-sm font-medium text-gray-600">
    Department
  </label>

  <input
    placeholder="Enter Department"
    value={form.department}
    onChange={(e) =>
      setForm({
        ...form,
        department: e.target.value,
      })
    }
    className="w-full rounded-xl border p-3 placeholder:text-gray-400"
  />
</div>

         <div>
  <label className="mb-1 block text-sm font-medium text-gray-600">
    Designation
  </label>

  <input
    placeholder="Enter Designation"
    value={form.designation}
    onChange={(e) =>
      setForm({
        ...form,
        designation: e.target.value,
      })
    }
    className="w-full rounded-xl border p-3 placeholder:text-gray-400"
  />
</div>

        </div>

        <div className="mt-6 flex justify-end gap-3">

          <button
            onClick={onClose}
            className="rounded-xl border px-5 py-2"
          >
            Cancel
          </button>

          <button
            onClick={updateFaculty}
            className="rounded-xl bg-[#355E3B] px-5 py-2 text-white"
          >
            Update
          </button>

        </div>

      </div>

    </div>
  );
}