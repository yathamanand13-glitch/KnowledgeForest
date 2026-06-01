"use client";

import {
  useState,
  useEffect,
} from "react";

import AppLayout from "@/components/AppLayout";

import { supabase } from "@/lib/supabase";

import {
  Search,
  GraduationCap,
  Star,
  BadgeCheck,
} from "lucide-react";

export default function FacultyPage() {

  const [
    searchTerm,
    setSearchTerm,
  ] = useState("");

  const [
    faculties,
    setFaculties,
  ] = useState<any[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  useEffect(() => {

    fetchFaculties();

  }, []);

  async function fetchFaculties() {

    setLoading(true);

    const {
      data,
      error,
    } =
      await supabase

        .from("faculties")

        .select("*")

        .order(
          "created_at",
          { ascending: false }
        );

    if (error) {

      console.log(error);

      setLoading(false);

      return;
    }

    setFaculties(data || []);

    setLoading(false);
  }

  const filteredFaculties =
    faculties.filter(
      (faculty) =>

        faculty.faculty_name
          ?.toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          )

        ||

        faculty.department
          ?.toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          )

        ||

        faculty.college_code
          ?.toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          )
    );

  if (loading) {

    return (

      <div className="flex min-h-screen items-center justify-center bg-[#DCE3CC]">

        <div className="h-14 w-14 animate-spin rounded-full border-4 border-[#355E3B] border-t-transparent" />

      </div>
    );
  }

  return (

    <AppLayout>

      <section className="px-6 py-16">

        <div className="mx-auto max-w-7xl">

          {/* Header */}
          <div className="mb-12">

            <h1 className="text-5xl font-bold text-[#1F2937]">
              Faculties
            </h1>

            <p className="mt-4 max-w-2xl text-lg text-gray-600">

              Verified educators contributing
              academic resources, notes,
              PDFs, and previous question
              papers.

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

              placeholder="Search faculties..."

              value={searchTerm}

              onChange={(e) =>
                setSearchTerm(
                  e.target.value
                )
              }

              className="w-full bg-transparent text-lg outline-none placeholder:text-gray-400"
            />
          </div>

          {/* Empty State */}
          {
            filteredFaculties.length === 0 && (

              <div className="rounded-3xl bg-white p-12 text-center shadow-sm">

                <h2 className="text-3xl font-bold text-[#1F2937]">

                  No Faculties Found

                </h2>

                <p className="mt-4 text-gray-500">

                  Try another search keyword.

                </p>
              </div>
            )
          }

          {/* Grid */}
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            {
              filteredFaculties.map(
                (faculty) => (

                  <div
                    key={faculty.id}

                    className="group rounded-3xl bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                  >

                    {/* Avatar */}
                    <div className="flex items-center justify-between">

                      {
                        faculty.profile_photo_url ?

                          <img
                            src={
                              faculty.profile_photo_url
                            }

                            alt="Faculty"

                            className="h-24 w-24 rounded-full object-cover shadow-lg"
                          />

                        :

                          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#355E3B] text-white">

                            <GraduationCap size={44} />

                          </div>
                      }

                      {
                        faculty.verified && (

                          <div className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">

                            Verified

                          </div>
                        )
                      }
                    </div>

                    {/* Content */}
                    <div className="mt-8">

                      <div className="flex items-center gap-3">

                        <h2 className="text-2xl font-bold text-[#1F2937]">

                          {
                            faculty.faculty_name
                          }

                        </h2>

                        {
                          faculty.verified && (

                            <BadgeCheck
                              className="text-[#355E3B]"
                              size={24}
                            />
                          )
                        }
                      </div>

                      <p className="mt-3 text-gray-500">

                        {
                          faculty.department
                        }

                      </p>

                      {
                        faculty.bio && (

                          <p className="mt-4 line-clamp-3 text-sm leading-7 text-gray-600">

                            {faculty.bio}

                          </p>
                        )
                      }

                      {/* Tags */}
                      <div className="mt-5 flex flex-wrap gap-3">

                        <span className="rounded-full bg-[#DCE3CC] px-4 py-2 text-sm font-medium text-[#355E3B]">

                          {
                            faculty.college_code
                          }

                        </span>

                        <span className="rounded-full bg-[#EEF2E6] px-4 py-2 text-sm font-medium text-[#355E3B]">

                          {
                            faculty.experience || 0
                          } Years

                        </span>
                      </div>

                      {/* Stats */}
                      <div className="mt-6 flex items-center justify-between">

                        <span className="text-sm font-medium text-gray-500">

                          {
                            faculty.uploads_count || 0
                          } Uploads

                        </span>

                        <div className="flex items-center gap-1 text-yellow-600">

                          <Star
                            size={16}
                            fill="currentColor"
                          />

                          <span className="text-sm font-medium">

                            {
                              faculty.rating || 0
                            }

                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Button */}
                    <button className="mt-8 w-full rounded-2xl bg-[#355E3B] py-4 text-lg font-medium text-white transition hover:bg-[#2d4f32]">

                      View Profile

                    </button>
                  </div>
                )
              )
            }
          </div>
        </div>
      </section>
    </AppLayout>
  );
}