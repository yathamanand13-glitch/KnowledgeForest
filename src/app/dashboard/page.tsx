"use client";

import FacultyLayout from "@/components/faculty/FacultyLayout";
import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Upload,
  FileText,
  Download,
  Eye,
  GraduationCap,
  Plus,
} from "lucide-react";



export default function DashboardPage() {


  const [resources, setResources] =
  useState<any[]>([]);

  const [showAll, setShowAll] =
  useState(false);

const [totalUploads, setTotalUploads] =
  useState(0);

const [totalDownloads, setTotalDownloads] =
  useState(0);

const [totalViews, setTotalViews] =
  useState(0);

  const router = useRouter();

  const [faculty, setFaculty] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

    useEffect(() => {

  fetchFaculty();

}, []);

async function fetchFaculty() {

  const {
    data: { session },
  } =
    await supabase.auth.getSession();

  if (!session?.user) {

    window.location.href =
      "/login";

    return;
  }

  const { data, error } =
    await supabase

      .from("faculties")

      .select("*")

      .eq(
        "email",
        session.user.email
      )

      .single();

  if (error) {

    console.log(error);

    return;
  }

  setFaculty(data);

  const {
  data: uploadedResources,
  error: resourceError,
} = await supabase
  .from("resources")
  .select("*")
  .eq("uploaded_by", data.id)
  .order("created_at", {
    ascending: false,
  });

if (!resourceError) {

  setResources(
    uploadedResources || []
  );

  setTotalUploads(
    uploadedResources.length
  );

  setTotalDownloads(
    uploadedResources.reduce(
      (sum, item) =>
        sum + (item.downloads || 0),
      0
    )
  );

  setTotalViews(
    uploadedResources.reduce(
      (sum, item) =>
        sum + (item.views || 0),
      0
    )
  );
}

  setLoading(false);
}

if (loading) {

  return (
    <FacultyLayout>

      <div className="flex min-h-[80vh] items-center justify-center">

        <div className="h-14 w-14 animate-spin rounded-full border-4 border-[#355E3B] border-t-transparent" />

      </div>

    </FacultyLayout>
  );
}

  return (
    <FacultyLayout>
      <section className="px-6 py-16">
        
        <div className="mx-auto max-w-7xl">
          
          {/* Welcome */}
          <div className="mb-14 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            
            <div>
              
              <h1 className="text-5xl font-bold text-[#1F2937]">
                Faculty Dashboard
              </h1>

              <p className="mt-4 max-w-2xl text-lg text-gray-600">
                Manage uploads, monitor resource
                performance, and contribute
                academic materials.
              </p>
            </div>

            {/* Upload Button */}
            <Link
            href="/upload"
            className="flex items-center justify-center gap-3 rounded-2xl bg-[#355E3B] px-8 py-4 text-lg font-medium text-white transition hover:bg-[#2d4f32]"
>
            <Plus size={24} />

             Upload Resource
            </Link>
          </div>

          {/* Stats */}
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              
              <Upload
                className="text-[#355E3B]"
                size={40}
              />

              <h2 className="mt-6 text-4xl font-bold">
                {totalUploads}
              </h2>

              <p className="mt-2 text-gray-500">
                Total Uploads
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              
              <Download
                className="text-[#355E3B]"
                size={40}
              />

              <h2 className="mt-6 text-4xl font-bold">
                {totalDownloads}
              </h2>

              <p className="mt-2 text-gray-500">
                Downloads
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              
              <Eye
                className="text-[#355E3B]"
                size={40}
              />

              <h2 className="mt-6 text-4xl font-bold">
                {totalViews}
              </h2>

              <p className="mt-2 text-gray-500">
                Resource Views
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              
              <FileText
                className="text-[#355E3B]"
                size={40}
              />

              <h2 className="mt-6 text-4xl font-bold">
                {faculty?.rating || 0}
              </h2>

              <p className="mt-2 text-gray-500">
                Average Rating
              </p>
            </div>
          </div>

          {/* Content Grid */}
          <div className="mt-16 grid gap-8 xl:grid-cols-3">
            
            {/* Recent Uploads */}
            <div className="xl:col-span-2 rounded-3xl bg-white p-8 shadow-sm">
              
              <div className="flex items-center justify-between">
                
                <h2 className="text-3xl font-bold">
                  Recent Uploads
                </h2>

                {resources.length > 3 && (

  <button
    onClick={() =>
      setShowAll(!showAll)
    }
    className="text-[#355E3B] hover:underline"
  >
    {showAll
      ? "View Less"
      : "View All"}
  </button>

)}
              </div>
<div className="mt-8 space-y-5">

  {resources.length === 0 ? (

    <div className="flex flex-col items-center justify-center py-12 text-center">

      <div className="mb-4 text-5xl">
        📂
      </div>

      <h3 className="text-xl font-semibold text-gray-700">
        No uploads yet
      </h3>

      <p className="mt-2 text-gray-500">
        Upload your first academic resource.
      </p>

      <Link
        href="/upload"
        className="mt-6 rounded-xl bg-[#355E3B] px-6 py-3 text-white"
      >
        Upload Resource
      </Link>

    </div>

  ) : (

    (showAll
      ? resources
      : resources.slice(0, 3)
    ).map((upload) => (

      <div
        key={upload.id}
        onClick={() =>
          router.push(
            `/manage-uploads/${upload.id}`
          )
        }
        className="cursor-pointer flex flex-col gap-5 rounded-2xl border border-gray-100 p-5 transition hover:shadow-md md:flex-row md:items-center md:justify-between"
      >

        <div>

          <h3 className="text-xl font-semibold">
            {upload.title}
          </h3>

          <p className="mt-2 text-gray-500">
            {upload.resource_type}
          </p>

        </div>

        <div className="flex gap-8 text-sm text-gray-500">

          <span>
            📥 {upload.downloads || 0}
          </span>

          <span>
            👁 {upload.views || 0}
          </span>

        </div>

      </div>

    ))

  )}

</div>
            </div>

            {/* Faculty Profile */}
            <div className="rounded-3xl bg-white p-8 shadow-sm">
              
              <div className="flex flex-col items-center text-center">
                
                {/* Avatar */}
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[#355E3B] text-white shadow-lg">
                  
                  <span className="text-4xl font-bold">

  {faculty?.faculty_name
    ?.charAt(0)
    ?.toUpperCase()}

</span>
                </div>

                <h2 className="mt-6 text-3xl font-bold">
                  {faculty?.faculty_name}
                </h2>

                <p className="mt-2 text-gray-500">
                  {faculty?.department}
                </p>

                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  
                  <span className="rounded-full bg-[#DCE3CC] px-4 py-2 text-sm font-medium text-[#355E3B]">
                    {faculty?.college_code}
                  </span>

                  {faculty?.is_verified ? (

  <span className="rounded-full bg-[#EEF2E6] px-4 py-2 text-sm font-medium text-green-700">
    ✅ Verified Faculty
  </span>

) : (

  <span className="rounded-full bg-red-100 px-4 py-2 text-sm font-medium text-red-700">
    ❌ Not Verified
  </span>

)}
                </div>

                {/* Quick Actions */}
                <div className="mt-10 w-full space-y-4">
                  
                  <Link
                   href="/settings"
                   className="block w-full rounded-2xl bg-[#355E3B] py-4 text-center text-lg font-medium text-white transition hover:bg-[#2d4f32]"
>
                   Edit Profile
                   </Link>

                  <Link
                  href="/manage-uploads"
                  className="block w-full rounded-2xl border border-[#355E3B] py-4 text-center text-lg font-medium text-[#355E3B] transition hover:bg-[#EEF2E6]"
>
                   Manage Uploads
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </FacultyLayout>
  );
}