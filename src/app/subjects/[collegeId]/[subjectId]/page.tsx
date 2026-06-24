"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import Link from "next/link";

import AppLayout from "@/components/AppLayout";

import { supabase } from "@/lib/supabase";

import {
  BookOpen,
  FileText,
  Download,
} from "lucide-react";

export default function SubjectDetailsPage() {

  const params = useParams();

  const collegeId =
    params.collegeId as string;

  const subjectId =
    params.subjectId as string;

  const [subject, setSubject] =
    useState<any>(null);

  const [resources, setResources] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    if (subjectId) {

      fetchData();

    }

  }, [subjectId]);

  async function fetchData() {

    setLoading(true);

    const {
      data: subjectData,
    } = await supabase
      .from("subjects")
      .select("*")
      .eq("id", subjectId)
      .single();

    setSubject(subjectData);

    const {
      data: resourceData,
    } = await supabase
      .from("resources")
      .select("*")
      .eq(
        "subject_id",
        subjectId
      )
      .order("created_at", {
        ascending: false,
      });

    setResources(
      resourceData || []
    );

    setLoading(false);
  }

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
              <Link
                href={`/subjects/${collegeId}`}
                className="font-medium text-[#355E3B]"
              >
                ← Back to Subjects
              </Link>

              <div className="mt-6 rounded-3xl bg-white p-8 shadow-sm">

                <div className="flex items-center gap-5">

                  <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#355E3B] text-white">

                    <BookOpen size={36} />

                  </div>

                  <div>

                    <h1 className="text-4xl font-bold">

                      {subject?.subject_name}

                    </h1>

                    <p className="mt-2 text-gray-500">

                      {subject?.subject_code}

                    </p>

                  </div>

                </div>

                <div className="mt-8 flex flex-wrap gap-3">

                  <span className="rounded-full bg-[#DCE3CC] px-4 py-2 text-[#355E3B]">

                    Semester {subject?.semester}

                  </span>

                  {subject?.course && (

                    <span className="rounded-full bg-[#EEF2E6] px-4 py-2 text-[#355E3B]">

                      {subject.course}

                    </span>

                  )}

                  {subject?.regulation && (

                    <span className="rounded-full bg-[#EEF2E6] px-4 py-2 text-[#355E3B]">

                      {subject.regulation}

                    </span>

                  )}

                </div>

              </div>

              <div className="mt-10">

                <h2 className="mb-6 text-3xl font-bold">

                  Resources Under This Subject

                </h2>

                {resources.length === 0 ? (

                  <div className="rounded-3xl bg-white p-10 text-center shadow-sm">

                    <FileText
                      className="mx-auto mb-4 text-gray-400"
                      size={60}
                    />

                    <h3 className="text-2xl font-bold text-gray-700">

                      No Resources Available

                    </h3>

                    <p className="mt-2 text-gray-500">

                      Faculties have not uploaded resources for this subject yet.

                    </p>

                  </div>

                ) : (

                  <div className="grid gap-5">

                    {resources.map(
                      (resource) => (

                        <Link
                          key={resource.id}
                          href={`/resources/${resource.id}`}
                          className="rounded-3xl bg-white p-6 shadow-sm transition hover:shadow-md"
                        >

                          <div className="flex items-center justify-between">

                            <div>

                              <h3 className="text-xl font-semibold">

                                {resource.title}

                              </h3>

                              <p className="mt-2 text-gray-500">

                                {resource.resource_type}

                              </p>

                            </div>

                            <div className="flex items-center gap-5 text-gray-500">

                              <span className="flex items-center gap-2">

                                <Download size={18} />

                                {resource.downloads || 0}

                              </span>

                            </div>

                          </div>

                        </Link>

                      )
                    )}

                  </div>

                )}

              </div>

            </>

          )}

        </div>

      </section>

    </AppLayout>
  );
}