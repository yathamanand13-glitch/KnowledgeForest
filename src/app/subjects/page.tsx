"use client";

import { useEffect, useState } from "react";

import AppLayout from "@/components/AppLayout";

import Link from "next/link";

import { supabase } from "@/lib/supabase";

import {
  Search,
  GraduationCap,
  MapPin,
  Building2,
} from "lucide-react";

export default function SubjectsPage() {
  const [searchTerm, setSearchTerm] =
    useState("");

  const [colleges, setColleges] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchColleges();
  }, []);

  async function fetchColleges() {
    const { data, error } =
      await supabase
        .from("colleges")
        .select("*")
        .order("name");

    if (!error) {
      setColleges(data || []);
    }

    setLoading(false);
  }

  const filteredColleges =
    colleges.filter((college) =>
      `${college.name} ${college.code} ${college.university}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

  return (
    <AppLayout>
      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">

          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl font-bold text-[#1F2937]">
              Subjects
            </h1>

            <p className="mt-4 max-w-3xl text-lg text-gray-600">
              Browse colleges and explore the
              subjects available in each college.
            </p>
          </div>

          {/* Search */}
          <div className="mb-12 flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm">
            <Search
              className="text-gray-500"
              size={24}
            />

            <input
              type="text"
              placeholder="Search colleges..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              className="w-full bg-transparent text-lg outline-none placeholder:text-gray-400"
            />
          </div>

          {/* Loading */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#355E3B] border-t-transparent" />
            </div>
          ) : filteredColleges.length === 0 ? (
            <div className="rounded-3xl bg-white p-12 text-center shadow-sm">
              <GraduationCap
                className="mx-auto mb-4 text-gray-400"
                size={60}
              />

              <h2 className="text-2xl font-bold text-gray-700">
                No Colleges Found
              </h2>

              <p className="mt-2 text-gray-500">
                No colleges match your search.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {filteredColleges.map(
                (college) => (
                  <div
                    key={college.id}
                    className="group rounded-3xl bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                  >

                    {/* Icon */}
                    <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#355E3B] text-white">
                      <GraduationCap size={38} />
                    </div>

                    {/* Content */}
                    <div className="mt-8">

                      <h2 className="text-2xl font-bold text-[#1F2937]">
                        {college.name}
                      </h2>

                      <p className="mt-2 text-gray-500">
                        {college.code}
                      </p>

                      <div className="mt-5 space-y-2">

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Building2 size={16} />
                          {college.university}
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin size={16} />
                          {college.location}
                        </div>
                      </div>

                      <div className="mt-5 flex items-center justify-between">

                        <div className="flex gap-3 flex-wrap">

  <span className="rounded-full bg-[#DCE3CC] px-4 py-2 text-sm font-medium text-[#355E3B]">
    {college.subject_count || 0} Subjects
  </span>

  <span className="rounded-full bg-[#EEF2E6] px-4 py-2 text-sm font-medium text-[#355E3B]">
    {college.resource_count || 0} Resources
  </span>

</div>
                      </div>
                    </div>

                    {/* Button */}
                    <Link
                      href={`/subjects/${college.id}`}
                      className="mt-8 block w-full rounded-2xl bg-[#355E3B] py-4 text-center text-lg font-medium text-white transition-all duration-300 hover:bg-[#2d4f32]"
                    >
                      Explore Subjects
                    </Link>
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