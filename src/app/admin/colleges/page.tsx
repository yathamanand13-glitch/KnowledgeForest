"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

import {
  Search,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";

interface College {
  id: string;
  name: string;
  code: string;
  university: string;
  location: string;
}

export default function AdminCollegesPage() {

  const [colleges, setColleges] =
    useState<College[]>([]);

    const [searchTerm,
  setSearchTerm] =
  useState("");

  const [loading, setLoading] =
    useState(true);

    const [showModal, setShowModal] =
  useState(false);

  const [editingCollegeId,
  setEditingCollegeId] =
  useState<string | null>(null);

const [name, setName] =
  useState("");

const [code, setCode] =
  useState("");

const [university, setUniversity] =
  useState("");

const [location, setLocation] =
  useState("");

  useEffect(() => {
    loadColleges();
  }, []);

  async function loadColleges() {

    setLoading(true);

    const { data, error } =
      await supabase
        .from("colleges")
        .select("*")
        .order("name");

    if (!error && data) {
      setColleges(data);
    }

    setLoading(false);
  }

  async function createCollege() {

  const { error } =
    await supabase
      .from("colleges")
      .insert([
        {
          name,
          code,
          university,
          location,
        },
      ]);

  if (!error) {

    setShowModal(false);

    setName("");
    setCode("");
    setUniversity("");
    setLocation("");

    loadColleges();
  }
}

async function deleteCollege(
  id: string
) {

  const confirmed =
    window.confirm(
      "Are you sure you want to delete this college?"
    );

  if (!confirmed) return;

  const { error } =
    await supabase
      .from("colleges")
      .delete()
      .eq("id", id);

  if (!error) {

    loadColleges();

  } else {

    alert(
      "Failed to delete college"
    );

  }
}

function openEditCollege(
  college: College
) {

  setEditingCollegeId(
    college.id
  );

  setName(college.name);

  setCode(college.code);

  setUniversity(
    college.university
  );

  setLocation(
    college.location
  );

  setShowModal(true);
}

async function updateCollege() {

  if (!editingCollegeId) return;

  const { error } =
    await supabase
      .from("colleges")
      .update({
        name,
        code,
        university,
        location,
      })
      .eq(
        "id",
        editingCollegeId
      );

  if (!error) {

    setShowModal(false);

    setEditingCollegeId(null);

    setName("");
    setCode("");
    setUniversity("");
    setLocation("");

    loadColleges();

  } else {

    alert(
      "Failed to update college"
    );

  }
}

const filteredColleges =
  colleges.filter(
    (college) =>

      college.name
        .toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        ) ||

      college.code
        .toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        ) ||

      college.university
        .toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        ) ||

      college.location
        .toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        )
  );

  return (

    
<div>

  <div className="mb-6">

    <h1 className="text-4xl font-bold text-[#355E3B]">
      Colleges Management
    </h1>

    <p className="mt-2 text-gray-500">
      Manage all colleges in KnowledgeForest
    </p>

  </div>

 <div className="mb-8 flex items-center justify-between">

  <div className="relative">

  <Search
    size={18}
    className="absolute left-4 top-4 text-gray-400"
  />

  <input
    type="text"
     value={searchTerm}
  onChange={(e) =>
    setSearchTerm(
      e.target.value
    )
  }
    placeholder="Search colleges..."
    className="w-[350px] rounded-xl border border-gray-300 bg-white py-3 pl-12 pr-4 outline-none focus:border-[#355E3B]"
  />

</div>

  <button
  onClick={() => {

  setEditingCollegeId(
    null
  );

  setName("");
  setCode("");
  setUniversity("");
  setLocation("");

  setShowModal(true);
}}
  className="flex items-center gap-2 rounded-xl bg-[#355E3B] px-6 py-3 font-medium text-white shadow"
>

  <Plus size={18} />

  Add College

</button>

</div>

      <div className="overflow-hidden rounded-3xl bg-white shadow-xl">

        {loading ? (

          <p>
            Loading colleges...
          </p>

        ) : colleges.length === 0 ? (

          <div className="py-16 text-center">

  <h3 className="text-xl font-semibold">
    No Colleges Found
  </h3>

  <p className="mt-2 text-gray-500">
    Create your first college.
  </p>

</div>

        ) : (

          <table className="w-full divide-y divide-gray-200">

            <thead>

              <tr className="border-b">

                <th className="px-6 py-4 text-left">
                  Name
                </th>

                <th className="px-6 py-4 text-left">
                  Code
                </th>

                <th className="px-6 py-4 text-left">
                  University
                </th>

                <th className="px-6 py-4 text-left">
                  Location
                </th>

                <th className="px-6 py-4 text-left">
  Actions
</th>

              </tr>

            </thead>

            <tbody>

              {filteredColleges.map((college) => (

                <tr
                  key={college.id}
                  className="border-b transition hover:bg-gray-50"
                >

                  <td className="px-6 py-4">
                    {college.name}
                  </td>

                  <td className="px-6 py-4">
                    {college.code}
                  </td>

                  <td className="px-6 py-4">
                    {college.university}
                  </td>

                  <td className="px-6 py-4">
                    {college.location}
                  </td>

                  <td className="px-6 py-4">

  <div className="flex gap-2">

    <button
  onClick={() =>
    openEditCollege(
      college
    )
  }
  className="flex items-center gap-2 rounded-lg bg-blue-500 px-3 py-2 text-white"
>

  <Pencil size={15} />

  Edit

</button>

   <button
  onClick={() =>
    deleteCollege(college.id)
  }
  className="flex items-center gap-2 rounded-lg bg-red-500 px-3 py-2 text-white"
>

  <Trash2 size={15} />

  Delete

</button>

  </div>

</td>

                </tr>

              ))}

            </tbody>

          </table>

        )}

       <div className="flex items-center justify-between border-t bg-gray-50 px-6 py-4">

  <p className="text-sm text-gray-500">
    Showing {filteredColleges.length} colleges
  </p>

  <div className="flex gap-3">

    <button
      className="rounded-lg border px-4 py-2 hover:bg-gray-100"
    >
      Previous
    </button>

    <button
      className="rounded-lg bg-[#355E3B] px-4 py-2 text-white"
    >
      1
    </button>

    <button
      className="rounded-lg border px-4 py-2 hover:bg-gray-100"
    >
      Next
    </button>

  </div>

</div>

      </div>

      {showModal && (

  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

    <div className="w-[500px] rounded-3xl bg-white p-8 shadow-2xl">

      <h2 className="mb-6 text-2xl font-bold">

  {editingCollegeId
    ? "Edit College"
    : "Add College"}

</h2>

      <div className="space-y-4">

        <input
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          placeholder="College Name"
          className="w-full rounded-xl border p-3"
        />

        <input
          value={code}
          onChange={(e) =>
            setCode(e.target.value)
          }
          placeholder="College Code"
          className="w-full rounded-xl border p-3"
        />

        <input
          value={university}
          onChange={(e) =>
            setUniversity(e.target.value)
          }
          placeholder="University"
          className="w-full rounded-xl border p-3"
        />

        <input
          value={location}
          onChange={(e) =>
            setLocation(e.target.value)
          }
          placeholder="Location"
          className="w-full rounded-xl border p-3"
        />

      </div>

      <div className="mt-6 flex justify-end gap-3">

        <button
          onClick={() =>
            setShowModal(false)
          }
          className="rounded-xl border px-5 py-2"
        >
          Cancel
        </button>

        <button
  onClick={() => {

    if (
      editingCollegeId
    ) {

      updateCollege();

    } else {

      createCollege();

    }
  }}
          className="rounded-xl bg-[#355E3B] px-5 py-2 text-white"
        >
          {
  editingCollegeId
    ? "Update"
    : "Create"
}
        </button>

      </div>

    </div>

  </div>

)}

    </div>

  );
}