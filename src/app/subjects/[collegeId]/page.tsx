"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import AppLayout from "@/components/AppLayout";

import { supabase } from "@/lib/supabase";

import Link from "next/link";

import {
  BookOpen,
  GraduationCap,
} from "lucide-react";

export default function CollegeSubjectsPage() {

  const params = useParams();

  const collegeId =
    params.collegeId as string;

  const [college, setCollege] =
    useState<any>(null);

  const [subjects, setSubjects] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    if (collegeId) {

      fetchData();
    }

  }, [collegeId]);

  async function fetchData() {

    setLoading(true);

    const {
      data: collegeData,
    } = await supabase
      .from("colleges")
      .select("*")
      .eq("id", collegeId)
      .single();

    if (collegeData) {

      setCollege(collegeData);
    }

    const {
      data: subjectData,
    } = await supabase
      .from("subjects")
      .select("*")
      .eq("college_id", collegeId)
      .order("semester");

    setSubjects(subjectData || []);

    setLoading(false);
  }

  const groupedSubjects =
    subjects.reduce(
      (
        acc: any,
        subject: any
      ) => {

        const semester =
          `Semester ${subject.semester}`;

        if (!acc[semester]) {

          acc[semester] = [];
        }

        acc[semester].push(subject);

        return acc;

      },
      {}
    );

  return (
    <AppLayout>

      <section className="px-6 py-16">

        <div className="mx-auto max-w-7xl">

          {loading ? (

            <div className="flex justify-center py-20">

              <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#355E3B] border-t-transparent" />

            </div>

          ) : (

            <>
              {/* Header */}

              <div className="mb-12">

                <h1 className="text-5xl font-bold text-[#1F2937]">

                  {college?.name}

                </h1>

                <p className="mt-4 text-lg text-gray-600">

                  Subjects available in this college

                </p>

              </div>

              {subjects.length === 0 ? (

                <div className="rounded-3xl bg-white p-12 text-center shadow-sm">

                  <GraduationCap
                    className="mx-auto mb-4 text-gray-400"
                    size={60}
                  />

                  <h2 className="text-2xl font-bold text-gray-700">

                    No Subjects Found

                  </h2>

                  <p className="mt-2 text-gray-500">

                    Faculties have not uploaded any subjects yet.

                  </p>

                </div>

              ) : (

                <div className="space-y-8">

                  {Object.entries(
                    groupedSubjects
                  ).map(
                    ([semester, list]: any) => (

                      <div
                        key={semester}
                        className="rounded-3xl bg-white p-8 shadow-sm"
                      >

                        <div className="mb-6 flex items-center justify-between">

  <h2 className="text-3xl font-bold text-[#355E3B]">
    {semester}
  </h2>

  <span className="rounded-full bg-[#DCE3CC] px-4 py-2 text-sm font-medium text-[#355E3B]">

    {list.length} Subjects

  </span>

</div>

                        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
{list.map(
  (subject: any) => (

    <Link
      href={`/subjects/${collegeId}/${subject.id}`}
      key={subject.id}
      className="rounded-2xl border border-gray-100 p-5 transition hover:shadow-md hover:border-[#355E3B] block"
    >

                                <div className="flex items-center gap-4">

                                  <div className="rounded-2xl bg-[#355E3B] p-3 text-white">

                                    <BookOpen
                                      size={24}
                                    />

                                  </div>

                                  <div>

                                    <h3 className="text-lg font-semibold">

                                      {subject.subject_name}

                                    </h3>

                                    <p className="text-sm text-gray-500">

                                      {subject.subject_code}

                                    </p>

                                  </div>

                                </div>

                                <div className="mt-4 flex items-center justify-between">

  <span
    className="rounded-full bg-[#DCE3CC] px-3 py-1 text-sm text-[#355E3B]"
  >
    {subject.course}
  </span>

  <span
    className="text-sm font-medium text-[#355E3B]"
  >
    {subject.resource_count || 0}
    {" "}
    Resources
  </span>

</div>

                              </Link>

                            )
                          )}

                        </div>

                      </div>

                    )
                  )}

                </div>

              )}

            </>

          )}

        </div>

      </section>

    </AppLayout>
  );
}