"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AddFacultyModal from "@/components/admin/AddFacultyModal";
import EditFacultyModal from "@/components/admin/EditFacultyModal";

interface Faculty {
  id: string;
  faculty_name: string;
  faculty_id: string;
  email: string;
  department: string;
  designation: string;
  status: string;
  approval_status: string;
  uploads_count: number;
}

export default function AdminFacultiesPage() {

  const [faculties, setFaculties] =
    useState<Faculty[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [searchTerm, setSearchTerm] =
    useState("");

    const [showAddModal, setShowAddModal] =
  useState(false);

  const [showEditModal, setShowEditModal] =
  useState(false);

const [selectedFaculty, setSelectedFaculty] =
  useState<any>(null);

  useEffect(() => {
    loadFaculties();
  }, []);

  async function loadFaculties() {

    setLoading(true);

    const { data } =
      await supabase
        .from("faculties")
        .select("*")
        .order("faculty_name");

    if (data) {
      setFaculties(data);
    }

    setLoading(false);
  }

  async function deleteFaculty(
    id: string
  ) {

    const confirmed =
      confirm(
        "Delete this faculty?"
      );

    if (!confirmed) return;

    await supabase
      .from("faculties")
      .delete()
      .eq("id", id);

    loadFaculties();
  }

  const filteredFaculties =
    faculties.filter(
      (faculty) =>
        faculty.faculty_name
          ?.toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          ) ||

        faculty.faculty_id
          ?.toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          ) ||

        faculty.email
          ?.toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          ) ||

        faculty.department
          ?.toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          )
    );

  return (

    <div>

      <div className="mb-8">

        <h1 className="text-5xl font-bold text-[#355E3B]">
          Faculty Management
        </h1>

        <p className="mt-2 text-gray-500">
          Manage all faculty accounts
        </p>

      </div>

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <input
          type="text"
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(
              e.target.value
            )
          }
          placeholder="Search faculty..."
          className="w-[350px] rounded-xl border border-gray-300 bg-white px-4 py-3"
        />

        <button
  onClick={() => {
  setSelectedFaculty(null);
  setShowAddModal(true);
}}
  className="rounded-xl bg-[#355E3B] px-6 py-3 font-medium text-white shadow"
>
  + Add Faculty
</button>

      </div>

      <div className="overflow-x-auto rounded-3xl bg-white shadow-xl">

        {loading ? (

          <div className="p-10 text-center">
            Loading...
          </div>

        ) : filteredFaculties.length === 0 ? (

          <div className="p-10 text-center">

            <h3 className="text-xl font-semibold">
              No Faculties Found
            </h3>

          </div>

        ) : (

          <div className="hidden md:block overflow-x-auto">

          <table className="min-w-[1400px] w-full">

            <thead>

              <tr className="border-b">

                <th className="px-6 py-5 text-left">
                  Faculty Name
                </th>

                <th className="text-left">
                  Faculty ID
                </th>

                <th className="text-left">
                  Email
                </th>

                <th className="text-left">
                  Department
                </th>

                <th className="text-left">
                  Designation
                </th>

                <th className="text-left">
                  Status
                </th>

                <th className="text-left">
                  Approval
                </th>

                <th className="text-left">
                  Uploads
                </th>

                <th className="text-left">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredFaculties.map(
                (faculty) => (

                  <tr
                    key={faculty.id}
                    className="border-b"
                  >

                    <td className="px-6 py-5">
                      {faculty.faculty_name}
                    </td>

                    <td>
                      {faculty.faculty_id}
                    </td>

                    <td>
                      {faculty.email}
                    </td>

                    <td>
                      {faculty.department}
                    </td>

                    <td>
                      {faculty.designation}
                    </td>

                    <td>

                      <span
                        className={`rounded-full px-3 py-1 text-sm ${
                          faculty.status ===
                          "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {faculty.status}
                      </span>

                    </td>

                    <td>

                      <span
                        className={`rounded-full px-3 py-1 text-sm ${
                          faculty.approval_status ===
                          "approved"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {
                          faculty.approval_status
                        }
                      </span>

                    </td>

                    <td>
                      {faculty.uploads_count}
                    </td>

                    <td>

  <div className="flex flex-wrap gap-2">

    <button
  onClick={() => {
  setSelectedFaculty(faculty);
  setShowEditModal(true);
}}
  className="rounded-lg bg-blue-500 px-3 py-2 text-white"
>
  Edit
</button>

    <button
      onClick={async () => {

        await supabase
          .from("faculties")
          .update({
            approval_status:
              "approved",
          })
          .eq(
            "id",
            faculty.id
          );

        loadFaculties();

      }}
      className="rounded-lg bg-green-600 px-3 py-2 text-white"
    >
      Approve
    </button>

    <button
      onClick={async () => {

        await supabase
          .from("faculties")
          .update({
            status:
              faculty.status ===
              "active"
                ? "inactive"
                : "active",
          })
          .eq(
            "id",
            faculty.id
          );

        loadFaculties();

      }}
      className="rounded-lg bg-orange-500 px-3 py-2 text-white"
    >
      {faculty.status === "active"
        ? "Deactivate"
        : "Activate"}
    </button>

    <button
      onClick={async () => {

        const newPassword =
          prompt(
            "Enter New Password"
          );

        if (!newPassword)
          return;

        await supabase
          .from("faculties")
          .update({
            password_hash:
              newPassword,
          })
          .eq(
            "id",
            faculty.id
          );

        alert(
          "Password Updated"
        );

      }}
      className="rounded-lg bg-purple-600 px-3 py-2 text-white"
    >
      Reset Password
    </button>

    <button
      onClick={() =>
        deleteFaculty(
          faculty.id
        )
      }
      className="rounded-lg bg-red-500 px-3 py-2 text-white"
    >
      Delete
    </button>

  </div>

</td>

                  </tr>
                )
              )}

            </tbody>

          </table>

          </div>

        )}

        <div className="space-y-4 p-4 md:hidden">

  {filteredFaculties.map((faculty) => (

    <div
      key={faculty.id}
      className="rounded-2xl border bg-white p-4 shadow"
    >

      <h3 className="text-lg font-bold">
        {faculty.faculty_name}
      </h3>

      <p className="mt-2 text-sm">
        <strong>ID:</strong>{" "}
        {faculty.faculty_id}
      </p>

      <p className="text-sm">
        <strong>Email:</strong>{" "}
        {faculty.email}
      </p>

      <p className="text-sm">
        <strong>Department:</strong>{" "}
        {faculty.department}
      </p>

      <p className="text-sm">
        <strong>Designation:</strong>{" "}
        {faculty.designation}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">

        <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
          {faculty.status}
        </span>

        <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm text-yellow-700">
          {faculty.approval_status}
        </span>

      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">

  <button
    onClick={() => {
      setSelectedFaculty(faculty);
      setShowEditModal(true);
    }}
    className="rounded-lg bg-blue-500 py-2 text-white"
  >
    Edit
  </button>

  <button
    onClick={async () => {

      await supabase
        .from("faculties")
        .update({
          approval_status: "approved",
        })
        .eq("id", faculty.id);

      loadFaculties();

    }}
    className="rounded-lg bg-green-600 py-2 text-white"
  >
    Approve
  </button>

  <button
    onClick={async () => {

      await supabase
        .from("faculties")
        .update({
          status:
            faculty.status === "active"
              ? "inactive"
              : "active",
        })
        .eq("id", faculty.id);

      loadFaculties();

    }}
    className="rounded-lg bg-orange-500 py-2 text-white"
  >
    {faculty.status === "active"
      ? "Deactivate"
      : "Activate"}
  </button>

  <button
    onClick={async () => {

      const newPassword =
        prompt(
          "Enter New Password"
        );

      if (!newPassword)
        return;

      await supabase
        .from("faculties")
        .update({
          password_hash:
            newPassword,
        })
        .eq(
          "id",
          faculty.id
        );

      alert(
        "Password Updated"
      );

    }}
    className="rounded-lg bg-purple-600 py-2 text-white"
  >
    Reset Password
  </button>

  <button
    onClick={() =>
      deleteFaculty(
        faculty.id
      )
    }
    className="col-span-2 rounded-lg bg-red-500 py-2 text-white"
  >
    Delete
  </button>

</div>

    </div>

  ))}

</div>

        <div className="flex items-center justify-between border-t p-6">

          <span className="text-gray-500">
            Showing {
              filteredFaculties.length
            } faculties
          </span>

          <div className="flex gap-3">

            <button className="rounded-lg border px-4 py-2">
              Previous
            </button>

            <button className="rounded-lg bg-[#355E3B] px-4 py-2 text-white">
              1
            </button>

            <button className="rounded-lg border px-4 py-2">
              Next
            </button>

          </div>

        </div>

      </div>

      <AddFacultyModal
  open={showAddModal}
  onClose={() =>
    setShowAddModal(false)
  }
  onSuccess={loadFaculties}
/>

<EditFacultyModal
  open={showEditModal}
  faculty={selectedFaculty}
  onClose={() => {
    setShowEditModal(false);
    setSelectedFaculty(null);
  }}
  onSuccess={loadFaculties}
/>

    </div>
  );
}