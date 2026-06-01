"use client";

import {
  useEffect,
  useState,
} from "react";

import FacultyLayout
from "@/components/faculty/FacultyLayout";

import Link from "next/link";

import { supabase }
from "@/lib/supabase";

import {
  Bookmark,
  Eye,
  Trash2,
  FileText,
  Star,
} from "lucide-react";

export default function
BookmarksPage() {

  const [
    bookmarks,
    setBookmarks,
  ] = useState<any[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  useEffect(() => {

    fetchBookmarks();

  }, []);

  async function fetchBookmarks() {

    setLoading(true);

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {

      window.location.href =
        "/login";

      return;
    }

    const {
      data,
      error,
    } =
      await supabase

        .from("bookmarks")

        .select(`
          *,
          resources (*)
        `)

        .eq(
          "faculty_email",
          user.email
        )

        .order(
          "created_at",
          {
            ascending: false,
          }
        );

    if (error) {

      console.log(error);

      setLoading(false);

      return;
    }

    setBookmarks(data || []);

    setLoading(false);
  }

  async function removeBookmark(
    id: string
  ) {

    const confirmed =
      confirm(
        "Remove bookmark?"
      );

    if (!confirmed) return;

    const { error } =
      await supabase

        .from("bookmarks")

        .delete()

        .eq("id", id);

    if (error) {

      alert(error.message);

      return;
    }

    setBookmarks((prev) =>
      prev.filter(
        (item) =>
          item.id !== id
      )
    );

    alert(
      "Bookmark removed"
    );
  }

  if (loading) {

    return (

      <div className="flex min-h-screen items-center justify-center bg-[#DCE3CC]">

        <div className="h-14 w-14 animate-spin rounded-full border-4 border-[#355E3B] border-t-transparent" />

      </div>
    );
  }

  return (

    <FacultyLayout>

      <section className="px-6 py-16">

        <div className="mx-auto max-w-7xl">

          {/* Header */}
          <div className="mb-14">

            <h1 className="text-5xl font-bold text-[#1F2937]">

              Bookmarks

            </h1>

            <p className="mt-4 max-w-2xl text-lg text-gray-600">

              Your saved academic resources,
              PDFs, notes, question papers,
              and important study materials.

            </p>
          </div>

          {/* Empty State */}
          {
            bookmarks.length === 0 && (

              <div className="rounded-3xl bg-white p-16 text-center shadow-sm">

                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#EEF2E6] text-[#355E3B]">

                  <Bookmark size={44} />

                </div>

                <h2 className="mt-8 text-3xl font-bold text-[#1F2937]">

                  No Bookmarks Yet

                </h2>

                <p className="mt-4 text-gray-500">

                  Save resources to quickly
                  access them later.

                </p>

                <Link
                  href="/dashboard/resources"

                  className="mt-8 inline-flex items-center justify-center rounded-2xl bg-[#355E3B] px-8 py-4 text-white transition hover:bg-[#2d4f32]"
                >

                  Explore Resources

                </Link>
              </div>
            )
          }

          {/* Bookmarks Grid */}
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            {
              bookmarks.map(
                (bookmark) => {

                  const resource =
                    bookmark.resources;

                  return (

                    <div
                      key={bookmark.id}

                      className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-2 hover:shadow-2xl"
                    >

                      {/* Thumbnail */}
                      {
                        resource?.thumbnail_url ?

                          <img
                            src={
                              resource.thumbnail_url
                            }

                            alt="Thumbnail"

                            className="h-52 w-full rounded-2xl object-cover"
                          />

                        :

                          <div className="flex h-52 w-full items-center justify-center rounded-2xl bg-[#355E3B] text-white">

                            <FileText size={52} />

                          </div>
                      }

                      {/* Content */}
                      <div className="mt-6">

                        <h2 className="line-clamp-2 text-2xl font-bold text-[#1F2937]">

                          {
                            resource?.title
                          }

                        </h2>

                        <div className="mt-4 flex flex-wrap gap-3">

                          <span className="rounded-full bg-[#DCE3CC] px-4 py-2 text-sm font-medium text-[#355E3B]">

                            {
                              resource?.subject_name
                            }

                          </span>

                          <span className="rounded-full bg-[#EEF2E6] px-4 py-2 text-sm font-medium text-[#355E3B]">

                            Semester {
                              resource?.semester
                            }

                          </span>
                        </div>

                        {/* Faculty */}
                        <p className="mt-4 text-sm text-gray-500">

                          Uploaded by{" "}

                          <span className="font-medium text-[#1F2937]">

                            {
                              resource?.faculty_name
                            }

                          </span>

                        </p>

                        {/* Stats */}
                        <div className="mt-5 flex items-center justify-between text-sm text-gray-500">

                          <span>

                            👁 {
                              resource?.views
                              || 0
                            } Views

                          </span>

                          <span>

                            📥 {
                              resource?.downloads
                              || 0
                            } Downloads

                          </span>
                        </div>

                        {/* Rating */}
                        <div className="mt-4 flex items-center gap-2 text-yellow-600">

                          <Star
                            size={18}
                            fill="currentColor"
                          />

                          <span className="font-medium">

                            {
                              resource?.rating
                              || 0
                            }

                          </span>
                        </div>

                        {/* Actions */}
                        <div className="mt-8 flex gap-4">

<>
    {console.log("BOOKMARK PREVIEW LINK:", `/dashboard/resources/${resource.id}`)}
  </>

                          {/* Preview */}
                          <Link
                             href={`/dashboard/resources/${resource.id}`}

                            className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-[#355E3B] px-5 py-3 font-medium text-[#355E3B] transition hover:bg-[#EEF2E6]"
                          >

                            <Eye size={18} />

                            Preview

                          </Link>

                          {/* Remove */}
                          <button
                            onClick={() =>
                              removeBookmark(
                                bookmark.id
                              )
                            }

                            className="flex items-center justify-center gap-2 rounded-2xl bg-red-500 px-5 py-3 font-medium text-white transition hover:bg-red-600"
                          >

                            <Trash2 size={18} />

                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }
              )
            }
          </div>
        </div>
      </section>
    </FacultyLayout>
  );
}