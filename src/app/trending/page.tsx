"use client";

import { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";
import { supabase } from "@/lib/supabase";

import {
  TrendingUp,
  Download,
  BookOpen,
  GraduationCap,
  Building2,
  Star,
} from "lucide-react";

export default function TrendingPage() {

  const [trendingResources, setTrendingResources] = useState<any[]>([]);
const [topSubjects, setTopSubjects] = useState<any[]>([]);
const [topColleges, setTopColleges] = useState<any[]>([]);
const [topFaculties, setTopFaculties] = useState<any[]>([]);

const [stats, setStats] = useState({
  downloads: 0,
  resources: 0,
  faculties: 0,
  colleges: 0,
});

const [loading, setLoading] = useState(true);

useEffect(() => {
  loadTrendingData();
}, []);

const loadTrendingData = async () => {
  try {
    const [
      resourcesRes,
      subjectsRes,
      collegesRes,
      facultiesRes,
    ] = await Promise.all([
      supabase
        .from("resources")
        .select("*")
        .eq("status", "approved"),

      supabase
        .from("subjects")
        .select("*"),

      supabase
        .from("colleges")
        .select("*"),

      supabase
        .from("faculties")
        .select("*"),
    ]);

    const resources = resourcesRes.data || [];
    const subjects = subjectsRes.data || [];
    const colleges = collegesRes.data || [];
    const faculties = facultiesRes.data || [];

   const sortedResources = [...resources]
  .filter((r) => (r.rating || 0) > 0)
  .sort((a, b) => (b.rating || 0) - (a.rating || 0))
  .slice(0, 6);

    const totalDownloads = resources.reduce(
      (sum, r) => sum + (r.downloads || 0),
      0
    );

    setTrendingResources(sortedResources);

    setTopSubjects(subjects.slice(0, 10));

    setTopColleges(colleges.slice(0, 10));

    setTopFaculties(faculties.slice(0, 6));

    setStats({
      downloads: totalDownloads,
      resources: sortedResources.length,
      faculties: faculties.length,
      colleges: colleges.length,
    });

  } catch (error) {
    console.error(error);
  }

  setLoading(false);
};

if (loading) {
  return (
    <AppLayout>
      <div className="p-10 text-center">
        Loading Trending Data...
      </div>
    </AppLayout>
  );
}

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
                {stats.downloads}
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
                {stats.resources}
              </h2>

              <p className="mt-2 text-gray-500">
                Trending Resources
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              
              <GraduationCap
                className="text-[#355E3B]"
                size={38}
              />

              <h2 className="mt-6 text-4xl font-bold">
                {stats.faculties}
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
                {stats.colleges}
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
                        {Number(resource.rating || 0).toFixed(1)}
                      </span>
                    </div>
                  </div>

                  <h3 className="mt-8 text-2xl font-bold">
                    {resource.title}
                  </h3>

                  <p className="mt-4 text-gray-500">
                    📥 {resource.downloads || 0} Downloads
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
                  key={subject.id}
                  className="rounded-full bg-white px-6 py-4 text-lg font-medium shadow-sm transition hover:shadow-lg"
                >
                  {subject.subject_name}
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
                  key={college.id}
                  className="rounded-full bg-white px-6 py-4 text-lg font-medium shadow-sm transition hover:shadow-lg"
                >
                  {college.name}
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
                  key={faculty.id}
                  className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-2 hover:shadow-2xl"
                >
                  
                  <GraduationCap
                    className="text-[#355E3B]"
                    size={38}
                  />

                  <h3 className="mt-6 text-2xl font-bold">
                    {faculty.faculty_name}
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