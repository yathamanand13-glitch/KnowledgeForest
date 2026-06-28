"use client";

import { useEffect, useState } from "react";

import AdminLayout from "@/components/admin/AdminLayout";
import AnalyticsCards from "@/components/admin/analytics/AnalyticsCards";
import UploadsChart from "@/components/admin/analytics/UploadsChart";
import CollegeChart from "@/components/admin/analytics/CollegeChart";
import ResourceTypeChart from "@/components/admin/analytics/ResourceTypeChart";
import FacultyChart from "@/components/admin/analytics/FacultyChart";
import TopResourcesTable from "@/components/admin/analytics/TopResourcesTable";

import { supabase } from "@/lib/supabase";

interface Stats {
  colleges: number;
  subjects: number;
  faculties: number;
  resources: number;
  downloads: number;
  views: number;
  rating: number;
  pendingFaculty: number;
}

export default function AdminAnalyticsPage() {

  const [loading, setLoading] =
    useState(true);

  const [stats, setStats] =
    useState<Stats>({
      colleges: 0,
      subjects: 0,
      faculties: 0,
      resources: 0,
      downloads: 0,
      views: 0,
      rating: 0,
      pendingFaculty: 0,
    });

  const [uploadsData, setUploadsData] =
    useState<any[]>([]);

  const [collegeData, setCollegeData] =
    useState<any[]>([]);

    const [resourceTypeData, setResourceTypeData] =
  useState<any[]>([]);

const [facultyUploadsData, setFacultyUploadsData] =
  useState<any[]>([]);

  const [topDownloads, setTopDownloads] =
useState<any[]>([]);

const [topViews, setTopViews] =
useState<any[]>([]);

const [recentUploads, setRecentUploads] =
useState<any[]>([]);

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {

    setLoading(true);

    // -------------------------
    // Dashboard Statistics
    // -------------------------

    const { data: adminStats } =
      await supabase
        .from("admin_stats")
        .select("*")
        .single();

    // -------------------------
    // Resources
    // -------------------------

    const { data: resources } =
      await supabase
        .from("resources")
        .select("*");

    // -------------------------
    // Faculties
    // -------------------------

    const { data: faculties } =
      await supabase
        .from("faculties")
        .select("approval_status");

    const totalDownloads =
      resources?.reduce(
        (sum, r) =>
          sum + (r.downloads || 0),
        0
      ) || 0;

    const totalViews =
      resources?.reduce(
        (sum, r) =>
          sum + (r.views || 0),
        0
      ) || 0;

    const averageRating =
      resources && resources.length
        ? (
            resources.reduce(
              (sum, r) =>
                sum + (r.rating || 0),
              0
            ) / resources.length
          ).toFixed(1)
        : "0";

    const pendingFaculty =
      faculties?.filter(
        (f) =>
          f.approval_status === "pending"
      ).length || 0;

    setStats({

      colleges:
        adminStats?.colleges || 0,

      subjects:
        adminStats?.subjects || 0,

      faculties:
        adminStats?.faculties || 0,

      resources:
        adminStats?.resources || 0,

      downloads:
        totalDownloads,

      views:
        totalViews,

      rating:
        Number(averageRating),

      pendingFaculty,

    });

    // -------------------------
    // Uploads Per Month
    // -------------------------

    const monthMap: Record<
      string,
      number
    > = {};

    resources?.forEach((resource) => {

      if (!resource.created_at)
        return;

      const month =
        new Date(
          resource.created_at
        ).toLocaleString(
          "default",
          {
            month: "short",
          }
        );

      monthMap[month] =
        (monthMap[month] || 0) + 1;

    });

    setUploadsData(

      Object.entries(monthMap).map(
        ([month, uploads]) => ({
          month,
          uploads,
        })
      )

    );

    // -------------------------
    // Resources By College
    // -------------------------

    const collegeMap: Record<
      string,
      number
    > = {};

    resources?.forEach((resource) => {

      const college =
        resource.college_name ||
        "Unknown";

      collegeMap[college] =
        (collegeMap[college] || 0) + 1;

    });

    setCollegeData(

      Object.entries(
        collegeMap
      ).map(
        ([college, resources]) => ({
          college,
          resources,
        })
      )

    );

    // -------------------------
// Resources By Type
// -------------------------

const typeMap: Record<string, number> = {};

resources?.forEach((resource) => {

  const type =
    resource.resource_type || "Other";

  typeMap[type] =
    (typeMap[type] || 0) + 1;

});

setResourceTypeData(

  Object.entries(typeMap).map(
    ([name, value]) => ({
      name,
      value,
    })
  )

);

// -------------------------
// Faculty Upload Count
// -------------------------

const facultyMap: Record<string, number> = {};

resources?.forEach((resource) => {

  const faculty =
    resource.faculty_name || "Unknown";

  facultyMap[faculty] =
    (facultyMap[faculty] || 0) + 1;

});

setFacultyUploadsData(

  Object.entries(facultyMap)

    .map(([faculty, uploads]) => ({
      faculty,
      uploads,
    }))

    .sort(
      (a, b) =>
        b.uploads - a.uploads
    )

    .slice(0, 10)

);

setTopDownloads(

  [...(resources || [])]

    .sort(
      (a, b) =>
        (b.downloads || 0) -
        (a.downloads || 0)
    )

    .slice(0, 5)

);

setTopViews(

  [...(resources || [])]

    .sort(
      (a, b) =>
        (b.views || 0) -
        (a.views || 0)
    )

    .slice(0, 5)

);

setRecentUploads(

  [...(resources || [])]

    .sort(
      (a, b) =>

        new Date(
          b.created_at
        ).getTime()

        -

        new Date(
          a.created_at
        ).getTime()

    )

    .slice(0, 5)

);

    setLoading(false);

  }

  return (

    <AdminLayout>

      <div className="space-y-8">

        <div>

          <h1 className="text-5xl font-bold text-[#355E3B]">

            Analytics

          </h1>

          <p className="mt-2 text-gray-600">

            Insights about the KnowledgeForest platform.

          </p>

        </div>

        {loading ? (

          <div className="py-24 text-center text-xl">

            Loading Analytics...

          </div>

        ) : (

          <>

            <AnalyticsCards
              stats={stats}
            />

           <div className="grid gap-8 xl:grid-cols-2">

  <UploadsChart
    data={uploadsData}
  />

  <CollegeChart
    data={collegeData}
  />

  <ResourceTypeChart
    data={resourceTypeData}
  />

  <FacultyChart
    data={facultyUploadsData}
  />

</div>

<div className="grid gap-8 xl:grid-cols-3">

  <TopResourcesTable
    title="Top Downloads"
    type="downloads"
    data={topDownloads}
  />

  <TopResourcesTable
    title="Top Viewed"
    type="views"
    data={topViews}
  />

  <TopResourcesTable
    title="Recent Uploads"
    type="recent"
    data={recentUploads}
  />

</div>

          </>

        )}

      </div>

    </AdminLayout>

  );

}