"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import AppLayout from "@/components/AppLayout";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

import {
  Search,
  Plus,
  Minus,
} from "lucide-react";

export default function CollegeDetailsPage() {
  const params = useParams();

  const collegeId = params.id as string;

  const [college, setCollege] = useState<any>(null);

  const [subjects, setSubjects] = useState<any[]>([]);

  const [faculties, setFaculties] = useState<any[]>([]);

  const [resources, setResources] = useState<any[]>([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [showCourses, setShowCourses] =
    useState(false);

  const [showFaculties, setShowFaculties] =
    useState(false);

  const [showResources, setShowResources] =
    useState(false);

    const [expandedCourse, setExpandedCourse] =
  useState<string | null>(null);

const [expandedSemester, setExpandedSemester] =
  useState<string | null>(null);

  const [expandedSubject, setExpandedSubject] =
  useState<string | null>(null);

const [expandedResourceType, setExpandedResourceType] =
  useState<string | null>(null);

  const [
  openResourceType,
  setOpenResourceType
] = useState("");

 useEffect(() => {
  if (collegeId) {
    loadData();
  }
}, [collegeId]);

 const loadData = async () => {

  console.log("COLLEGE ID:", collegeId);

  if (!collegeId) return;

  const [
    collegeRes,
    subjectsRes,
    facultiesRes,
    resourcesRes,
  ] = await Promise.all([
      supabase
        .from("colleges")
        .select("*")
        .eq("id", collegeId)
        .single(),

      supabase
        .from("subjects")
        .select("*")
        .eq("college_id", collegeId),

      supabase
        .from("faculties")
        .select("*")
        .eq("college_id", collegeId),

      supabase
        .from("resources")
        .select("*")
        .eq("college_id", collegeId),
    ]);

    console.log("COLLEGE:", collegeRes);
console.log("SUBJECTS:", subjectsRes);
console.log("FACULTIES:", facultiesRes);
console.log("RESOURCES:", resourcesRes);
if (collegeRes.error) {
  console.error(
    "COLLEGE ERROR:",
    collegeRes.error
  );
}

if (collegeRes.data) {
  setCollege(collegeRes.data);
}

    if (subjectsRes.data)
      setSubjects(subjectsRes.data);

    if (facultiesRes.data)
      setFaculties(facultiesRes.data);

    if (resourcesRes.data)
      setResources(resourcesRes.data);
  };

  const groupedCourses =
  subjects.reduce(
    (acc: any, subject: any) => {

      const course =
        subject.course || "Unknown";

      if (!acc[course]) {
        acc[course] = [];
      }

      acc[course].push(subject);

      return acc;

    },
    {}
  );

  const resourceGroups =
  resources.reduce(
    (acc: any, resource: any) => {

      const type =
        resource.resource_type || "Other";

      if (!acc[type]) {
        acc[type] = [];
      }

      acc[type].push(resource);

      return acc;

    },
    {}
  );

  if (!college) {
  return (
    <AppLayout>
      <div className="p-10">
        College not loaded
      </div>
    </AppLayout>
  );
}

  return (
    <AppLayout>
      <section className="mx-auto max-w-6xl px-6 py-12">

        {/* Header */}

        <h1 className="text-5xl font-bold text-[#1F2937]">
          {college.name}
        </h1>

        <p className="mt-3 text-lg text-gray-500">
          {college.code}
        </p>

        <p className="mt-2 text-gray-600">
          {college.location}
        </p>

        {/* Search */}

        <div className="mt-10 flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm">

          <Search size={22} />

          <input
            type="text"
            placeholder="Search resources, subjects, faculties..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
            className="w-full outline-none"
          />

        </div>

        {/* COURSES */}

        <div className="mt-10">

          <button
            onClick={() =>
              setShowCourses(!showCourses)
            }
            className="flex w-full items-center justify-between rounded-2xl bg-white px-6 py-5 text-xl font-semibold shadow-sm"
          >
            Courses

            {showCourses ? (
              <Minus />
            ) : (
              <Plus />
            )}
          </button>

         {showCourses && (
  <div className="mt-4 rounded-2xl bg-white p-6 shadow-sm">

    {Object.keys(groupedCourses).map(
      (course) => {

        const courseSubjects =
          groupedCourses[course];

        const semesters = [
          ...new Set(
            courseSubjects.map(
              (s: any) => s.semester
            )
          ),
        ];

        return (
          <div
            key={course}
            className="mb-4"
          >

            <button
              onClick={() =>
                setExpandedCourse(
                  expandedCourse === course
                    ? null
                    : course
                )
              }
              className="flex w-full items-center justify-between rounded-xl bg-[#EEF2E6] px-4 py-3 font-semibold"
            >
              {course}

              {expandedCourse ===
              course ? (
                <Minus size={18} />
              ) : (
                <Plus size={18} />
              )}
            </button>

            {expandedCourse ===
              course && (
              <div className="mt-3 ml-4">

                {semesters.map(
                  (semester: any) => (

                    <div
                      key={semester}
                      className="mb-3"
                    >

                      <button
                        onClick={() =>
                          setExpandedSemester(
                            expandedSemester ===
                              `${course}-${semester}`
                              ? null
                              : `${course}-${semester}`
                          )
                        }
                        className="flex w-full items-center justify-between rounded-lg bg-gray-100 px-4 py-2"
                      >

                        Semester{" "}
                        {semester}

                        {expandedSemester ===
                        `${course}-${semester}` ? (
                          <Minus size={16} />
                        ) : (
                          <Plus size={16} />
                        )}

                      </button>

                      {expandedSemester ===
                        `${course}-${semester}` && (
                        <div className="mt-2 ml-4">

                         {courseSubjects
  .filter(
    (s: any) =>
      s.semester === semester
  )
  .map((subject: any) => {

    const subjectResources =
      resources.filter(
        (resource: any) =>
          resource.subject_id ===
          subject.id
      );

    const groupedTypes =
      subjectResources.reduce(
        (acc: any, resource: any) => {

          const type =
            resource.resource_type ||
            "Other";

          if (!acc[type]) {
            acc[type] = [];
          }

          acc[type].push(resource);

          return acc;

        },
        {}
      );

    return (

      <div
        key={subject.id}
        className="mb-3 rounded-xl border"
      >

        {/* SUBJECT */}

        <button
          onClick={() =>
            setExpandedSubject(
              expandedSubject ===
                subject.id
                ? null
                : subject.id
            )
          }
          className="flex w-full items-center justify-between bg-gray-50 px-4 py-3 font-medium"
        >

          {subject.subject_name}

          {expandedSubject ===
          subject.id ? (
            <Minus size={16} />
          ) : (
            <Plus size={16} />
          )}

        </button>

        {expandedSubject ===
          subject.id && (

          <div className="p-3">

            {Object.entries(
              groupedTypes
            ).map(
              ([type, items]: any) => (

                <div
                  key={type}
                  className="mb-2 rounded-lg border"
                >

                  {/* RESOURCE TYPE */}

                  <button
                    onClick={() =>
                      setExpandedResourceType(
                        expandedResourceType ===
                          `${subject.id}-${type}`
                          ? null
                          : `${subject.id}-${type}`
                      )
                    }
                    className="flex w-full items-center justify-between px-4 py-3"
                  >

                    {type}

                    {expandedResourceType ===
                    `${subject.id}-${type}` ? (
                      <Minus size={14} />
                    ) : (
                      <Plus size={14} />
                    )}

                  </button>

                  {expandedResourceType ===
                    `${subject.id}-${type}` && (

                    <div className="border-t p-3">

                      {items.map(
                        (
                          resource: any
                        ) => (

                         <Link
  key={resource.id}
  href={`/resources/${resource.id}`}
  className="block border-b py-2 hover:text-green-700"
>
  {resource.title}
</Link>

                        )
                      )}

                    </div>
                  )}

                </div>
              )
            )}

          </div>
        )}

      </div>
    );
  })}

                        </div>
                      )}

                    </div>
                  )
                )}

              </div>
            )}

          </div>
        );
      }
    )}

  </div>
)}
        </div>

        {/* FACULTIES */}

        <div className="mt-6">

          <button
            onClick={() =>
              setShowFaculties(!showFaculties)
            }
            className="flex w-full items-center justify-between rounded-2xl bg-white px-6 py-5 text-xl font-semibold shadow-sm"
          >
            Faculties

            {showFaculties ? (
              <Minus />
            ) : (
              <Plus />
            )}
          </button>

          {showFaculties && (
            <div className="mt-4 rounded-2xl bg-white p-6 shadow-sm">

              {faculties.map((faculty) => (
                <div
                  key={faculty.id}
                  className="border-b py-3"
                >
                  <h3 className="font-semibold">
                    {faculty.faculty_name}
                  </h3>

                  <p className="text-gray-500">
                    {faculty.department}
                  </p>
                </div>
              ))}

            </div>
          )}
        </div>

        {/* RESOURCES */}

        <div className="mt-6">

          <button
            onClick={() =>
              setShowResources(!showResources)
            }
            className="flex w-full items-center justify-between rounded-2xl bg-white px-6 py-5 text-xl font-semibold shadow-sm"
          >
            Resources

            {showResources ? (
              <Minus />
            ) : (
              <Plus />
            )}
          </button>

          {showResources && (
            <div className="mt-4 rounded-2xl bg-white p-6 shadow-sm">

              {Object.entries(resourceGroups).map(
  ([type, items]: any) => (

    <div
      key={type}
      className="mb-4 rounded-2xl border"
    >

      <button
        onClick={() =>
          setOpenResourceType(
            openResourceType === type
              ? ""
              : type
          )
        }
        className="flex w-full items-center justify-between p-4 text-left font-semibold"
      >

        {type}

        <span>

          {openResourceType === type
            ? "−"
            : "+"}

        </span>

      </button>

      {openResourceType === type && (

        <div className="border-t p-4">

          {items.map(
            (resource: any) => (

              <Link
  key={resource.id}
  href={`/resources/${resource.id}`}
  className="block border-b py-3 hover:text-green-700"
>
  {resource.title}
</Link>

            )
          )}

        </div>

      )}

    </div>

  )
)}

            </div>
          )}
        </div>

      </section>
    </AppLayout>
  );
}