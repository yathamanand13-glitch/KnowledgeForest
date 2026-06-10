"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import FacultyLayout
from "@/components/faculty/FacultyLayout";

import { supabase } from "@/lib/supabase";


import {
  Download,
  BookOpen,
  Bookmark,
} from "lucide-react";


interface Resource {

  id: string;

  title: string;

  description: string;

  resource_type: string;

  semester: string;

  file_url: string;

  thumbnail_url: string;

  subject_id: string | null;

  college_id: string | null;

  uploaded_by: string | null;

  subject_name?: string;

  college_name?: string;

  faculty_name?: string;

  views?: number;
}

export default function ResourceDetailsPage() {

    useEffect(() => {
  console.log("PUBLIC PREVIEW PAGE");
  console.log("PATH:", window.location.pathname);
}, []);

  const params = useParams();

  const id = params.id as string;

  const [resource, setResource] =
    useState<Resource | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [bookmarkLoading,
  setBookmarkLoading] =
  useState(false);

const [bookmarked,
  setBookmarked] =
  useState(false);

  useEffect(() => {

    if (id) {

      fetchResource();

    }

  }, [id]);


async function checkBookmark(
  resourceId: string
) {

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  if (!user) return;

  const { data } =
    await supabase

      .from("bookmarks")

      .select("id")

      .eq(
        "faculty_email",
        user.email
      )

      .eq(
        "resource_id",
        resourceId
      )

      .maybeSingle();

  setBookmarked(!!data);
}

async function toggleBookmark() {

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  if (!user) {

    alert(
      "Please login first"
    );

    return;
  }

  if (!resource) return;

  setBookmarkLoading(true);

  if (bookmarked) {

    const { error } =
      await supabase

        .from("bookmarks")

        .delete()

        .eq(
          "faculty_email",
          user.email
        )

        .eq(
          "resource_id",
          resource.id
        );

    if (error) {

      alert(error.message);

      setBookmarkLoading(false);

      return;
    }

    setBookmarked(false);

  } else {

    const { error } =
      await supabase

        .from("bookmarks")

        .insert({

          faculty_email:
            user.email,

          resource_id:
            resource.id,
        });

    if (error) {

      alert(error.message);

      setBookmarkLoading(false);

      return;
    }

    setBookmarked(true);
  }

  setBookmarkLoading(false);
}

 async function fetchResource() {

  setLoading(true);

  const {
    data: resourceData,
    error,
  } = await supabase
    .from("resources")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !resourceData) {

    console.error(error);

    setLoading(false);

    return;
  }

 // SESSION VIEW PROTECTION

const viewedKey =
  `resource_viewed_${resourceData.id}`;

const alreadyViewed =
  sessionStorage.getItem(
    viewedKey
  );

let updatedViews =
  resourceData.views || 0;

// Increment ONLY once per session

if (!alreadyViewed) {

  updatedViews += 1;

  await supabase
    .from("resources")
    .update({
      views: updatedViews
    })
    .eq("id", resourceData.id);

  sessionStorage.setItem(
    viewedKey,
    "true"
  );
}

console.log(
  "PDF URL:",
  resourceData.file_url
);

// Update local state

setResource({
  ...resourceData,
  views: updatedViews
});

await checkBookmark(
  resourceData.id
);

setLoading(false);
}

  if (loading) {

    return (

      <FacultyLayout>

        <div className="flex min-h-screen items-center justify-center text-3xl font-bold">

          Loading...

        </div>

      </FacultyLayout>
    );
  }

 const fileUrl =
  resource?.file_url || "";

const extension =
  resource?.file_type
    ?.toLowerCase() || "";

const imageFiles = [
  "jpg",
  "jpeg",
  "png",
  "webp",
  "gif",
];

const officeFiles = [
  "doc",
  "docx",
  "ppt",
  "pptx",
  "xls",
  "xlsx",
];

const officeViewerUrl =
  `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
    fileUrl
  )}`;

  if (!resource) {

    return (

      <FacultyLayout>

        <div className="flex min-h-screen items-center justify-center text-3xl font-bold text-red-500">

          Resource not found

        </div>

      </FacultyLayout>
    );
  }

  return (

    <FacultyLayout>

      <section className="px-6 py-16">

        <div className="mx-auto max-w-7xl">

          <div className="grid gap-10 lg:grid-cols-2">

            {/* IMAGE */}

            <div className="overflow-hidden rounded-3xl bg-white shadow-lg">

             <img
  src={
    resource.thumbnail_url ||
    "/placeholder.png"
  }
  alt={resource.title}
  onError={(e) => {
    e.currentTarget.src =
      "/placeholder.png";
  }}
  className="h-full w-full object-cover"
/>

            </div>

            {/* CONTENT */}

            <div>

              <div className="flex items-center gap-3">

                <BookOpen
                  className="text-[#355E3B]"
                  size={30}
                />

                <span className="rounded-full bg-[#DCE3CC] px-4 py-2 text-sm font-semibold text-[#355E3B]">

                  {resource.resource_type}

                </span>

              </div>

              <h1 className="mt-6 text-5xl font-bold text-[#1F2937]">

                {resource.title}

              </h1>

              <p className="mt-6 text-lg leading-relaxed text-gray-600">

                {
                  resource.description ||
                  "No description available"
                }

              </p>

              {/* META */}

              <div className="mt-8 space-y-4 text-lg text-gray-700">

                <p>

                  📚 Subject:
                  {" "}
                  {resource.subject_name || "N/A"}

                </p>

                <p>

                  🎓 College:
                  {" "}
                  {resource.college_name || "N/A"}

                </p>

                <p>

                  👨‍🏫 Faculty:
                  {" "}
                  {resource.faculty_name || "N/A"}

                </p>

                <p>

                  📚 Semester:
                  {" "}
                  {resource.semester || "N/A"}

                </p>

              </div>

             {/* ACTIONS */}

<div className="mt-10 flex flex-wrap gap-4">

  {/* DOWNLOAD */}

  <a
  href={resource.file_url}
  download
  className="inline-flex items-center gap-3 rounded-2xl bg-[#355E3B] px-8 py-4 text-lg font-semibold text-white transition hover:bg-[#2d4f32]"
>
  <Download size={24} />
  Download File
</a>

  {/* BOOKMARK */}

  <button
    onClick={toggleBookmark}

    disabled={bookmarkLoading}

    className={`inline-flex items-center gap-3 rounded-2xl px-8 py-4 text-lg font-semibold transition ${
      bookmarked

        ? "bg-yellow-500 text-white hover:bg-yellow-600"

        : "border border-[#355E3B] text-[#355E3B] hover:bg-[#EEF2E6]"
    }`}
  >

    <Bookmark
      size={24}

      fill={
        bookmarked
          ? "currentColor"
          : "none"
      }
    />

    {
      bookmarked
        ? "Bookmarked"
        : "Bookmark"
    }

  </button>
</div>

            </div>

          </div>

       {/* FILE PREVIEW */}

<div className="mt-16 rounded-3xl bg-white p-6 shadow-2xl">

  <h2 className="mb-6 text-3xl font-bold">

    Resource Preview

  </h2>

  {/* PDF */}

  {extension === "pdf" && (

    <div className="overflow-hidden rounded-2xl border">

      <iframe
  src={fileUrl}
  title="Resource Preview"
  className="h-[900px] w-full"
/>

    </div>

  )}

  {/* IMAGE */}

  {imageFiles.includes(
    extension || ""
  ) && (

    <img
      src={fileUrl}
      alt={resource.title}
      className="w-full rounded-2xl"
    />

  )}

  {/* OFFICE */}

  {officeFiles.includes(
    extension || ""
  ) && (

    <iframe
  src={officeViewerUrl}
  title="Resource Preview"
  className="h-[900px] w-full rounded-2xl border"
/>

  )}

  {/* FALLBACK */}

  {![
    "pdf",
    ...imageFiles,
    ...officeFiles,
  ].includes(
    extension || ""
  ) && (

    <div className="rounded-2xl border p-10 text-center">

      <p className="mb-5 text-xl">

        Preview not available

      </p>

      <a
  href={resource.file_url}
  download
  className="inline-flex items-center gap-3 rounded-2xl bg-[#355E3B] px-8 py-4 text-lg font-semibold text-white transition hover:bg-[#2d4f32]"
>
  <Download size={24} />
  Download File
</a>

    </div>

  )}

</div>

        </div>

      </section>

    </FacultyLayout>
  );
}