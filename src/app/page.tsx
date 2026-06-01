"use client";

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

import AppLayout from "@/components/AppLayout";
import FadeIn from "@/components/animations/FadeIn";

import { Search } from "lucide-react";

export default function Home() {

  const [searchTerm, setSearchTerm] = useState("");

  // Colleges State
  const [colleges, setColleges] = useState<
    {
      id: string;
      name: string;
      code: string;
      university: string;
      location: string;
      logo_url: string;
      created_at: string;
    }[]
  >([]);

  // Subjects State
  const [subjects, setSubjects] = useState<
    {
      id: string;
      subject_name: string;
      subject_code: string;
      semester: number;
      course: string;
      regulation: string;
      college_id: string;
      created_at: string;
    }[]
  >([]);

  // Resources State
  const [resources, setResources] = useState<
    {
      id: string;
      title: string;
      description: string;
      resource_type: string;
      file_url: string;
      thumbnail_url: string;
      downloads: number;
      rating: number;
      hash: string;
      status: string;
      subject_id: string;
      college_id: string;
      uploaded_by: string;
      created_at: string;
    }[]
  >([]);

  // Faculties State
  const [faculties, setFaculties] = useState<
    {
      id: string;
      faculty_name: string;
      faculty_id: string;
      email: string;
      password_hash: string;
      profile_photo_url: string;
      verified: boolean;
      college_id: string;
      created_at: string;
    }[]
  >([]);

  useEffect(() => {

    const fetchColleges = async () => {
      const { data, error } = await supabase
        .from("colleges")
        .select("*");

      if (error) {
        console.log(error);
      } else {
        setColleges(data);
      }
    };

    const fetchSubjects = async () => {
      const { data, error } = await supabase
        .from("subjects")
        .select("*");

      if (error) {
        console.log(error);
      } else {
        setSubjects(data);
      }
    };

    const fetchResources = async () => {
      const { data, error } = await supabase
        .from("resources")
        .select("*");

      if (error) {
        console.log(error);
      } else {
        setResources(data);
      }
    };

    const fetchFaculties = async () => {
      const { data, error } = await supabase
        .from("faculties")
        .select("*");

      if (error) {
        console.log(error);
      } else {
        setFaculties(data);
      }
    };

    fetchColleges();
    fetchSubjects();
    fetchResources();
    fetchFaculties();

  }, []);

  // Filtered Colleges
  const filteredColleges = colleges.filter((college) =>
    college.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filtered Resources
  const filteredResources = resources.filter((resource) =>
    resource.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppLayout>

      {/* Hero Section */}
      <FadeIn>
        <section
          id="hero"
          className="flex flex-col items-center justify-center px-6 pb-24 pt-28 text-center"
        >

          <h2 className="max-w-5xl text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl">
            Explore Academic Knowledge Across Colleges
          </h2>

          <p className="mt-6 max-w-3xl text-base leading-relaxed text-gray-600 sm:text-lg md:text-xl">
            Access notes, question papers, PDFs, and trusted academic resources
            shared by verified faculties.
          </p>

          {/* Search Bar */}
          <div className="mt-10 flex w-full max-w-3xl flex-col gap-4 rounded-2xl bg-white p-4 shadow-md md:flex-row md:items-center">

            <Search className="hidden text-gray-500 md:block" size={22} />

            <input
              type="text"
              placeholder="Search colleges, subjects, notes..."
              className="w-full bg-transparent text-lg outline-none placeholder:text-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <button className="w-full rounded-xl bg-[#355E3B] px-6 py-3 text-white transition hover:bg-[#2d4f32] md:w-auto">
              Search
            </button>
          </div>

          {/* Quick Filters */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">

            <button className="rounded-full bg-white px-5 py-2 shadow-sm hover:shadow-md transition">
              Colleges
            </button>

            <button className="rounded-full bg-white px-5 py-2 shadow-sm hover:shadow-md transition">
              Subjects
            </button>

            <button className="rounded-full bg-white px-5 py-2 shadow-sm hover:shadow-md transition">
              Notes
            </button>

            <button className="rounded-full bg-white px-5 py-2 shadow-sm hover:shadow-md transition">
              Question Papers
            </button>
          </div>
        </section>
      </FadeIn>

      {/* Colleges Section */}
      <section id="colleges" className="px-6 py-16">

        <div className="mx-auto max-w-7xl">

          <div className="mb-10 flex items-center justify-between">

            <div>
              <h3 className="text-3xl font-bold">
                Popular Colleges
              </h3>

              <p className="mt-2 text-gray-600">
                Explore resources shared across top institutions.
              </p>
            </div>

            <button className="rounded-xl bg-white px-5 py-3 shadow-sm hover:shadow-md transition">
              View All
            </button>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {filteredColleges.map((college) => (
              <div
                key={college.id}
                className="group rounded-3xl bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-6"
              >

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#355E3B] text-2xl font-bold text-white">
                   {
    college.code
      ?.trim()
      ?.charAt(0)
      ?.toUpperCase()
      || "C"
  }
                </div>

                <div className="mt-6">

                  <h4 className="text-lg font-semibold sm:text-xl">
                    {college.name}
                  </h4>

                  <p className="mt-2 text-sm text-gray-500">
                    {college.location}
                  </p>

                  <p className="mt-2 text-sm text-[#355E3B] font-medium">
                    {college.university}
                  </p>
                </div>

                <div className="mt-6">
                  <button className="w-full rounded-xl bg-[#355E3B] py-3 text-white opacity-0 transition group-hover:opacity-100">
                    Explore
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section
        id="resources"
        className="px-6 pb-24"
      >

        <div className="mx-auto max-w-7xl">

          <div className="mb-10 flex items-center justify-between">

            <div>
              <h3 className="text-3xl font-bold">
                Trending Resources
              </h3>

              <p className="mt-2 text-gray-600">
                Most downloaded and highly rated academic materials.
              </p>
            </div>

            <button className="rounded-xl bg-white px-5 py-3 shadow-sm hover:shadow-md transition">
              Browse All
            </button>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

            {filteredResources.map((resource) => (
              <div
                key={resource.id}
                className="group rounded-3xl bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl sm:p-6"
              >

                <div className="flex h-40 items-center justify-center rounded-2xl bg-[#EEF2E6] text-5xl transition duration-300 group-hover:scale-105">
                  📄
                </div>

                <div className="mt-6">

                  <h4 className="text-lg font-semibold leading-snug sm:text-xl">
                    {resource.title}
                  </h4>

                  <p className="mt-2 text-sm text-gray-500">
                    {resource.resource_type}
                  </p>

                  <div className="mt-4 flex items-center justify-between text-sm">

                    <span className="rounded-full bg-[#DCE3CC] px-3 py-1 text-[#355E3B]">
                      Approved Resource
                    </span>

                    <span className="font-medium text-yellow-600">
                      ⭐ {resource.rating}
                    </span>
                  </div>

                  <p className="mt-4 text-sm text-gray-500">
                    📥 {resource.downloads} Downloads
                  </p>
                </div>

                <div className="mt-6 flex gap-3">

                  <button className="flex-1 rounded-xl border border-[#355E3B] py-3.5 font-medium text-[#355E3B] transition-all duration-300 hover:bg-[#EEF2E6] hover:shadow-sm">
                    Preview
                  </button>

                  <button className="flex-1 rounded-xl bg-[#355E3B] py-3.5 font-medium text-white transition-all duration-300 hover:bg-[#2d4f32] hover:shadow-lg">
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Faculties Section */}
      <section
        id="faculty"
        className="px-6 pb-24"
      >

        <div className="mx-auto max-w-7xl">

          <div className="mb-10">

            <h3 className="text-3xl font-bold">
              Top Contributing Faculties
            </h3>

            <p className="mt-2 text-gray-600">
              Verified educators sharing trusted academic resources.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            {faculties.map((faculty) => (
              <div
                key={faculty.id}
                className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >

                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#355E3B] text-2xl font-bold text-white">
                  {faculty.faculty_name.charAt(0)}
                </div>

                <div className="mt-6">

                  <h4 className="text-2xl font-semibold">
                    {faculty.faculty_name}
                  </h4>

                  <p className="mt-2 text-gray-500">
                    Verified Faculty
                  </p>

                  <div className="mt-5 flex items-center justify-between">

                    <span className="rounded-full bg-[#DCE3CC] px-4 py-2 text-sm font-medium text-[#355E3B]">
                      ✔ Verified
                    </span>

                    <span className="text-sm text-gray-500">
                      Active Contributor
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#C7D0B6] px-6 py-12">

        <div className="mx-auto flex max-w-7xl flex-col gap-10 md:flex-row md:items-start md:justify-between">

          <div className="max-w-md">

            <h3 className="text-2xl font-bold">
              KnowledgeForest
            </h3>

            <p className="mt-4 text-gray-600 leading-relaxed">
              A centralized academic resource ecosystem connecting colleges,
              faculties, and students through trusted educational materials.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">

            <div>
              <h4 className="font-semibold">
                Platform
              </h4>

              <ul className="mt-4 space-y-3 text-gray-600">
                <li>Colleges</li>
                <li>Resources</li>
                <li>Subjects</li>
                <li>Faculty</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold">
                Company
              </h4>

              <ul className="mt-4 space-y-3 text-gray-600">
                <li>About</li>
                <li>Contact</li>
                <li>Privacy</li>
                <li>Terms</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold">
                Account
              </h4>

              <ul className="mt-4 space-y-3 text-gray-600">
                <li>Faculty Login</li>
                <li>Dashboard</li>
                <li>Bookmarks</li>
                <li>Settings</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-[#C7D0B6] pt-6 text-center text-sm text-gray-500">
          © 2026 KnowledgeForest. All rights reserved.
        </div>
      </footer>

    </AppLayout>
  );
}