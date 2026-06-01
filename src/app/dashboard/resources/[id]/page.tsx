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

import "react-pdf/dist/Page/AnnotationLayer.css";

import { pdfjs } from "react-pdf";

import "react-pdf/dist/Page/TextLayer.css";

import dynamic from "next/dynamic";

const Document = dynamic(
  () =>
    import("react-pdf").then(
      (mod) => mod.Document
    ),
  { ssr: false }
);

const Page = dynamic(
  () =>
    import("react-pdf").then(
      (mod) => mod.Page
    ),
  { ssr: false }
);

pdfjs.GlobalWorkerOptions.workerSrc =
  `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;


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

  const [numPages, setNumPages] =
    useState<number>(0);

 const [pageNumber, setPageNumber] =
  useState(1);

const [scale, setScale] =
  useState(1.2);

const [screenWidth, setScreenWidth] =
  useState(1200);

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

  useEffect(() => {

  const handleResize = () => {
    setScreenWidth(window.innerWidth);
  };

  handleResize();

  window.addEventListener(
    "resize",
    handleResize
  );

  return () =>
    window.removeEventListener(
      "resize",
      handleResize
    );

}, []);

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

function getPageWidth() {

  if (screenWidth < 640) {

    return screenWidth - 30;

  }

  if (screenWidth < 1024) {

    return screenWidth - 100;

  }

  return Math.min(
    1000,
    screenWidth - 300
  );

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

    target="_blank"

    rel="noopener noreferrer"

    className="inline-flex items-center gap-3 rounded-2xl bg-[#355E3B] px-8 py-4 text-lg font-semibold text-white transition hover:bg-[#2d4f32]"
  >

    <Download size={24} />

    Download PDF

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

       {/* PDF VIEWER */}

<div className="mt-16 rounded-3xl bg-white p-3 shadow-2xl sm:p-6 lg:p-10">

  {/* CONTROLS */}

  <div className="mb-8 flex flex-wrap items-center justify-center gap-4">

    {/* PREVIOUS */}

    <button
      onClick={() =>
        setPageNumber((prev) =>
          Math.max(prev - 1, 1)
        )
      }
      disabled={pageNumber <= 1}
      className="
        rounded-xl
        bg-[#355E3B]
        px-5
        py-2
        text-white
        transition
        disabled:cursor-not-allowed
        disabled:opacity-50
      "
    >
      Previous
    </button>

    {/* PAGE COUNT */}

    <div className="text-lg font-semibold">

      Page {pageNumber} of {numPages}

    </div>

    {/* NEXT */}

    <button
      onClick={() =>
        setPageNumber((prev) =>
          numPages > 0
            ? Math.min(prev + 1, numPages)
            : prev
        )
      }
      disabled={pageNumber >= numPages}
      className="
        rounded-xl
        bg-[#355E3B]
        px-5
        py-2
        text-white
        transition
        disabled:cursor-not-allowed
        disabled:opacity-50
      "
    >
      Next
    </button>

    {/* ZOOM OUT */}

    <button
      onClick={() =>
        setScale((prev) =>
          Math.max(prev - 0.2, 0.6)
        )
      }
      disabled={scale <= 0.6}
      className="
        rounded-xl
        border
        px-4
        py-2
        transition
        disabled:cursor-not-allowed
        disabled:opacity-50
      "
    >
      Zoom -
    </button>

    {/* ZOOM IN */}

    <button
      onClick={() =>
        setScale((prev) =>
          Math.min(prev + 0.2, 3)
        )
      }
      disabled={scale >= 3}
      className="
        rounded-xl
        border
        px-4
        py-2
        transition
        disabled:cursor-not-allowed
        disabled:opacity-50
      "
    >
      Zoom +
    </button>

  </div>

  {/* PDF CONTAINER */}

  <div
    className="
      max-h-[90vh]
      overflow-auto
      rounded-2xl
      border
      bg-gray-100
      p-2
      sm:p-4
    "
  >

    <div className="flex justify-center">

      {resource.file_url ? (

       <Document
  file={resource.file_url}

  onLoadSuccess={({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
  }}

  onLoadError={(err) => {
    console.error(
      "PDF LOAD ERROR:",
      err
    );
  }}

  loading={
    <div className="flex items-center justify-center py-10">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#355E3B] border-t-transparent" />
    </div>
  }

  error={
    <p className="text-center text-red-500">
      Failed to load PDF.
      The file may be corrupted
      or blocked by CORS.
    </p>
  }
>

          <Page
            pageNumber={pageNumber}

            width={getPageWidth()}

            scale={scale}

            renderTextLayer={false}

            renderAnnotationLayer={false}
          />

        </Document>

      ) : (

        <div className="text-center text-xl text-red-500">

          No PDF Available

        </div>

      )}

    </div>

  </div>

</div>

        </div>

      </section>

    </FacultyLayout>
  );
}