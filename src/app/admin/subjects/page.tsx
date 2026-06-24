"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

interface Subject {
  id: string;
  subject_name: string;
  subject_code: string;
  semester: number;
  course: string;
  regulation: string;
  resource_count: number;
}

export default function AdminSubjectsPage() {

  const [subjects, setSubjects] =
    useState<Subject[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [showModal, setShowModal] =
    useState(false);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [subjectName, setSubjectName] =
    useState("");

  const [subjectCode, setSubjectCode] =
    useState("");

  const [semester, setSemester] =
    useState("");

  const [course, setCourse] =
    useState("");

  const [regulation, setRegulation] =
    useState("");

  useEffect(() => {
    loadSubjects();
  }, []);

  async function loadSubjects() {

    setLoading(true);

    const { data } =
      await supabase
        .from("subjects")
        .select("*")
        .order("subject_name");

    if (data) {
      setSubjects(data);
    }

    setLoading(false);
  }

  async function addSubject() {

    if (
      !subjectName ||
      !subjectCode ||
      !semester
    ) {
      alert("Please fill all fields");
      return;
    }

    const { error } =
      await supabase
        .from("subjects")
        .insert([
          {
            subject_name: subjectName,
            subject_code: subjectCode,
            semester: Number(semester),
            course,
            regulation,
          },
        ]);

    if (!error) {

      resetForm();

      setShowModal(false);

      loadSubjects();
    }
  }

  async function updateSubject() {

    if (!editingId) return;

    const { error } =
      await supabase
        .from("subjects")
        .update({
          subject_name: subjectName,
          subject_code: subjectCode,
          semester: Number(semester),
          course,
          regulation,
        })
        .eq("id", editingId);

    if (!error) {

      resetForm();

      setShowModal(false);

      setEditingId(null);

      loadSubjects();
    }
  }

  async function deleteSubject(
    id: string
  ) {

    const confirmed =
      confirm(
        "Delete this subject?"
      );

    if (!confirmed) return;

    await supabase
      .from("subjects")
      .delete()
      .eq("id", id);

    loadSubjects();
  }

  function resetForm() {

    setSubjectName("");
    setSubjectCode("");
    setSemester("");
    setCourse("");
    setRegulation("");
  }

  const filteredSubjects =
    subjects.filter(
      (subject) =>
        subject.subject_name
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          ) ||

        subject.subject_code
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          ) ||

        subject.course
          ?.toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          ) ||

        subject.regulation
          ?.toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          )
    );

  return (

    <div>

      <div className="mb-8">

        <h1 className="text-5xl font-bold text-[#355E3B]">
          Subjects Management
        </h1>

        <p className="mt-2 text-gray-500">
          Manage all subjects in KnowledgeForest
        </p>

      </div>

      <div className="mb-8 flex items-center justify-between">

        <input
          type="text"
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(
              e.target.value
            )
          }
          placeholder="Search subjects..."
          className="w-[350px] rounded-xl border border-gray-300 bg-white px-4 py-3"
        />

        <button
          onClick={() =>
            setShowModal(true)
          }
          className="rounded-xl bg-[#355E3B] px-6 py-3 font-medium text-white shadow"
        >
          + Add Subject
        </button>

      </div>

      <div className="overflow-hidden rounded-3xl bg-white shadow-xl">

        {loading ? (

          <div className="p-10 text-center">
            Loading...
          </div>

        ) : filteredSubjects.length === 0 ? (

          <div className="p-10 text-center">

            <h3 className="text-xl font-semibold">
              No Subjects Found
            </h3>

            <p className="mt-2 text-gray-500">
              Create your first subject.
            </p>

          </div>

        ) : (

          <table className="w-full">

            <thead>

              <tr className="border-b">

                <th className="px-6 py-5 text-left">
                  Subject Name
                </th>

                <th className="text-left">
                  Code
                </th>

                <th className="text-left">
                  Semester
                </th>

                <th className="text-left">
                  Course
                </th>

                <th className="text-left">
                  Regulation
                </th>

                <th className="text-left">
                  Resources
                </th>

                <th className="text-left">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredSubjects.map(
                (subject) => (

                  <tr
                    key={subject.id}
                    className="border-b"
                  >

                    <td className="px-6 py-5">
                      {
                        subject.subject_name
                      }
                    </td>

                    <td>
                      {
                        subject.subject_code
                      }
                    </td>

                    <td>
                      {
                        subject.semester
                      }
                    </td>

                    <td>
                      {
                        subject.course
                      }
                    </td>

                    <td>
                      {
                        subject.regulation
                      }
                    </td>

                    <td>
                      {
                        subject.resource_count
                      }
                    </td>

                    <td>

                      <div className="flex gap-2">

                        <button
                          onClick={() => {

                            setEditingId(
                              subject.id
                            );

                            setSubjectName(
                              subject.subject_name
                            );

                            setSubjectCode(
                              subject.subject_code
                            );

                            setSemester(
                              String(
                                subject.semester
                              )
                            );

                            setCourse(
                              subject.course
                            );

                            setRegulation(
                              subject.regulation
                            );

                            setShowModal(
                              true
                            );
                          }}
                          className="rounded-lg bg-blue-500 px-3 py-2 text-white"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            deleteSubject(
                              subject.id
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

        )}

        <div className="flex items-center justify-between border-t p-6">

          <span className="text-gray-500">
            Showing {
              filteredSubjects.length
            } subjects
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

      {showModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

          <div className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-2xl">

            <h2 className="mb-6 text-3xl font-bold text-[#355E3B]">

              {editingId
                ? "Edit Subject"
                : "Add Subject"}

            </h2>

            <div className="space-y-4">

              <input
                value={subjectName}
                onChange={(e) =>
                  setSubjectName(
                    e.target.value
                  )
                }
                placeholder="Subject Name"
                className="w-full rounded-xl border p-3"
              />

              <input
                value={subjectCode}
                onChange={(e) =>
                  setSubjectCode(
                    e.target.value
                  )
                }
                placeholder="Subject Code"
                className="w-full rounded-xl border p-3"
              />

              <input
                value={semester}
                onChange={(e) =>
                  setSemester(
                    e.target.value
                  )
                }
                placeholder="Semester"
                className="w-full rounded-xl border p-3"
              />

              <input
                value={course}
                onChange={(e) =>
                  setCourse(
                    e.target.value
                  )
                }
                placeholder="Course"
                className="w-full rounded-xl border p-3"
              />

              <input
                value={regulation}
                onChange={(e) =>
                  setRegulation(
                    e.target.value
                  )
                }
                placeholder="Regulation"
                className="w-full rounded-xl border p-3"
              />

            </div>

            <div className="mt-8 flex justify-end gap-3">

              <button
                onClick={() => {

                  resetForm();

                  setEditingId(
                    null
                  );

                  setShowModal(
                    false
                  );
                }}
                className="rounded-xl border px-5 py-2"
              >
                Cancel
              </button>

              <button
                onClick={() =>

                  editingId
                    ? updateSubject()
                    : addSubject()
                }
                className="rounded-xl bg-[#355E3B] px-5 py-2 text-white"
              >
                Save Subject
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}