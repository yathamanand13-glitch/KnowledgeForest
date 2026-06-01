"use client";

import AppLayout from "@/components/AppLayout";

import {
  TrendingUp,
  Download,
  BookOpen,
  GraduationCap,
  Building2,
  Star,
} from "lucide-react";

const trendingResources = [
  {
    title: "DBMS Complete Notes",
    downloads: "12.4K",
    rating: "5.0",
  },

  {
    title: "OS Important Questions",
    downloads: "9.8K",
    rating: "4.9",
  },

  {
    title: "CN Quick Revision PDF",
    downloads: "8.6K",
    rating: "4.8",
  },
];

const topSubjects = [
  "DBMS",
  "Operating Systems",
  "Computer Networks",
  "Data Structures",
  "Cloud Computing",
];

const topColleges = [
  "JNTUH",
  "VTU",
  "OU",
  "IITH",
  "BITS",
];

const topFaculties = [
  "Dr. Rajesh Kumar",
  "Prof. Ananya Rao",
  "Dr. Kiran Patel",
];

export default function TrendingPage() {
  return (
    <AppLayout>
      <section className="px-6 py-16">
        
        <div className="mx-auto max-w-7xl">
          
          {/* Header */}
          <div className="mb-14">
            
            <h1 className="flex items-center gap-4 text-5xl font-bold text-[#1F2937]">
              
              <TrendingUp
                className="text-[#355E3B]"
                size={50}
              />

              Trending
            </h1>

            <p className="mt-4 max-w-2xl text-lg text-gray-600">
              Discover the most popular academic
              resources, faculties, subjects, and
              colleges across the platform.
            </p>
          </div>

          {/* Stats */}
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              
              <Download
                className="text-[#355E3B]"
                size={38}
              />

              <h2 className="mt-6 text-4xl font-bold">
                120K+
              </h2>

              <p className="mt-2 text-gray-500">
                Total Downloads
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              
              <BookOpen
                className="text-[#355E3B]"
                size={38}
              />

              <h2 className="mt-6 text-4xl font-bold">
                4.5K+
              </h2>

              <p className="mt-2 text-gray-500">
                Academic Resources
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              
              <GraduationCap
                className="text-[#355E3B]"
                size={38}
              />

              <h2 className="mt-6 text-4xl font-bold">
                800+
              </h2>

              <p className="mt-2 text-gray-500">
                Verified Faculties
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              
              <Building2
                className="text-[#355E3B]"
                size={38}
              />

              <h2 className="mt-6 text-4xl font-bold">
                150+
              </h2>

              <p className="mt-2 text-gray-500">
                Colleges Connected
              </p>
            </div>
          </div>

          {/* Trending Resources */}
          <div className="mt-16">
            
            <h2 className="mb-8 text-3xl font-bold">
              Top Resources
            </h2>

            <div className="grid gap-6 lg:grid-cols-3">
              
              {trendingResources.map((resource) => (
                <div
                  key={resource.title}
                  className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-2 hover:shadow-2xl"
                >
                  
                  <div className="flex items-center justify-between">
                    
                    <TrendingUp
                      className="text-[#355E3B]"
                      size={34}
                    />

                    <div className="flex items-center gap-1 text-yellow-600">
                      
                      <Star
                        size={16}
                        fill="currentColor"
                      />

                      <span className="font-medium">
                        {resource.rating}
                      </span>
                    </div>
                  </div>

                  <h3 className="mt-8 text-2xl font-bold">
                    {resource.title}
                  </h3>

                  <p className="mt-4 text-gray-500">
                    📥 {resource.downloads} Downloads
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Top Subjects */}
          <div className="mt-16">
            
            <h2 className="mb-8 text-3xl font-bold">
              Trending Subjects
            </h2>

            <div className="flex flex-wrap gap-4">
              
              {topSubjects.map((subject) => (
                <div
                  key={subject}
                  className="rounded-full bg-white px-6 py-4 text-lg font-medium shadow-sm transition hover:shadow-lg"
                >
                  {subject}
                </div>
              ))}
            </div>
          </div>

          {/* Top Colleges */}
          <div className="mt-16">
            
            <h2 className="mb-8 text-3xl font-bold">
              Top Colleges
            </h2>

            <div className="flex flex-wrap gap-4">
              
              {topColleges.map((college) => (
                <div
                  key={college}
                  className="rounded-full bg-white px-6 py-4 text-lg font-medium shadow-sm transition hover:shadow-lg"
                >
                  {college}
                </div>
              ))}
            </div>
          </div>

          {/* Top Faculties */}
          <div className="mt-16">
            
            <h2 className="mb-8 text-3xl font-bold">
              Top Faculties
            </h2>

            <div className="grid gap-6 md:grid-cols-3">
              
              {topFaculties.map((faculty) => (
                <div
                  key={faculty}
                  className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-2 hover:shadow-2xl"
                >
                  
                  <GraduationCap
                    className="text-[#355E3B]"
                    size={38}
                  />

                  <h3 className="mt-6 text-2xl font-bold">
                    {faculty}
                  </h3>

                  <p className="mt-3 text-gray-500">
                    Verified Contributor
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}