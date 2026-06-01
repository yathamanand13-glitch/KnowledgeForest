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
  FileText,
  Eye,
  Pencil,
  Trash2,
  Plus,
} from "lucide-react";

export default function
ManageUploadsPage() {

  const [
    uploads,
    setUploads,
  ] = useState<any[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  useEffect(() => {

    fetchUploads();

  }, []);

  async function fetchUploads() {

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

        .from("resources")

        .select("*")

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

    setUploads(data || []);

    setLoading(false);
  }

  async function deleteResource(
    id: string
  ) {

    const confirmed =
      confirm(
        "Delete this resource?"
      );

    if (!confirmed) return;

    const { error } =
      await supabase

        .from("resources")

        .delete()

        .eq("id", id);

    if (error) {

      alert(error.message);

      return;
    }

    setUploads((prev) =>
      prev.filter(
        (item) =>
          item.id !== id
      )
    );

    alert(
      "Resource deleted successfully"
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
          <div className="mb-14 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <h1 className="text-5xl font-bold text-[#1F2937]">
                Manage Uploads
              </h1>

              <p className="mt-4 max-w-2xl text-lg text-gray-600">

                Manage your uploaded
                resources, track
                performance, and edit
                academic materials.

              </p>
            </div>

            {/* Upload Button */}
            <Link
              href="/upload"

              className="flex items-center justify-center gap-3 rounded-2xl bg-[#355E3B] px-8 py-4 text-lg font-medium text-white transition hover:bg-[#2d4f32]"
            >

              <Plus size={24} />

              New Upload

            </Link>
          </div>

          {/* Empty State */}
          {
            uploads.length === 0 && (

              <div className="rounded-3xl bg-white p-16 text-center shadow-sm">

                <h2 className="text-3xl font-bold text-[#1F2937]">

                  No Uploads Yet

                </h2>

                <p className="mt-4 text-gray-500">

                  Upload your first
                  academic resource.

                </p>

                <Link
                  href="/upload"

                  className="mt-8 inline-flex items-center justify-center rounded-2xl bg-[#355E3B] px-8 py-4 text-white transition hover:bg-[#2d4f32]"
                >

                  Upload Resource

                </Link>
              </div>
            )
          }

          {/* Upload Cards */}
          <div className="space-y-6">

            {
              uploads.map(
                (upload) => (

                  <div
                    key={upload.id}

                    className="rounded-3xl bg-white p-6 shadow-sm transition hover:shadow-xl"
                  >

                    <div className="flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">

                      {/* Left */}
                      <div className="flex gap-5">

                        {/* Thumbnail */}
                        {
                          upload.thumbnail_url ?

                            <img
                              src={
                                upload.thumbnail_url
                              }

                              alt="Thumbnail"

                              className="h-20 w-20 rounded-3xl object-cover"
                            />

                          :

                            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#355E3B] text-white">

                              <FileText size={38} />

                            </div>
                        }

                        {/* Content */}
                        <div>

                          <h2 className="text-2xl font-bold text-[#1F2937]">

                            {
                              upload.title
                            }

                          </h2>

                          <div className="mt-4 flex flex-wrap gap-3">

                            <span className="rounded-full bg-[#DCE3CC] px-4 py-2 text-sm font-medium text-[#355E3B]">

                              {
                                upload.subject_name
                              }

                            </span>

                            <span
                              className={`rounded-full px-4 py-2 text-sm font-medium ${
                                upload.status ===
                                "approved"

                                  ? "bg-green-100 text-green-700"

                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >

                              {
                                upload.status
                              }

                            </span>
                          </div>

                          {/* Stats */}
                          <div className="mt-5 flex flex-wrap gap-6 text-sm text-gray-500">

                            <span>

                              📥 {
                                upload.downloads
                                || 0
                              } Downloads

                            </span>

                            <span>

                              👁 {
                                upload.views
                                || 0
                              } Views

                            </span>

                            <span>

                              📅 {
                                new Date(
                                  upload.created_at
                                ).toLocaleDateString()
                              }

                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-4">

                        {/* Preview */}
                        <Link
                          href={`/dashboard/resources/${upload.id}`}

                          className="flex items-center gap-2 rounded-2xl border border-[#355E3B] px-5 py-3 font-medium text-[#355E3B] transition hover:bg-[#EEF2E6]"
                        >

                          <Eye size={18} />

                          Preview

                        </Link>

                        {/* Edit */}
                        <button
                          className="flex items-center gap-2 rounded-2xl bg-[#355E3B] px-5 py-3 font-medium text-white transition hover:bg-[#2d4f32]"
                        >

                          <Pencil size={18} />

                          Edit

                        </button>

                        {/* Delete */}
                        <button
                          onClick={() =>
                            deleteResource(
                              upload.id
                            )
                          }

                          className="flex items-center gap-2 rounded-2xl bg-red-500 px-5 py-3 font-medium text-white transition hover:bg-red-600"
                        >

                          <Trash2 size={18} />

                          Delete

                        </button>
                      </div>
                    </div>
                  </div>
                )
              )
            }
          </div>
        </div>
      </section>
    </FacultyLayout>
  );
}