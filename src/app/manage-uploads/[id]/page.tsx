"use client";

import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

import FacultyLayout from "@/components/faculty/FacultyLayout";

export default function ManageUploadPage() {

  const { id } = useParams();

  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [resource, setResource] = useState<any>(null);

  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");

  const [resourceType, setResourceType] =
    useState("");

  const [semester, setSemester] =
    useState("");

  const [tags, setTags] =
    useState("");

  useEffect(() => {

    if (id) {

      fetchResource();

    }

  }, [id]);

  async function fetchResource() {

    const { data, error } =
      await supabase

        .from("resources")

        .select("*")

        .eq("id", id)

        .single();

    if (error) {

      console.log(error);

      alert("Resource not found");

      router.push("/dashboard");

      return;
    }

    setResource(data);

    setTitle(data.title || "");

    setDescription(
      data.description || ""
    );

    setResourceType(
      data.resource_type || ""
    );

    setSemester(
      data.semester || ""
    );

    setTags(
      Array.isArray(data.tags)
        ? data.tags.join(", ")
        : ""
    );

    setLoading(false);
  }

  async function handleUpdate() {

    setSaving(true);

    const { error } =
      await supabase

        .from("resources")

        .update({

          title,

          description,

          resource_type:
            resourceType,

          semester,

          tags: tags
            .split(",")
            .map((tag) =>
              tag.trim()
            )
            .filter(Boolean),

        })

        .eq("id", id);

    setSaving(false);

    if (error) {

      console.log(error);

      alert(error.message);

      return;
    }

    alert(
      "Resource updated successfully!"
    );

    fetchResource();
  }

  async function handleDelete() {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this resource?"
      );

    if (!confirmed) return;

    const { error } =
      await supabase

        .from("resources")

        .delete()

        .eq("id", id);

    if (error) {

      console.log(error);

      alert(error.message);

      return;
    }

    alert(
      "Resource deleted successfully!"
    );

    if (resource.subject_id) {

  const { data: subject } =
    await supabase
      .from("subjects")
      .select("resource_count")
      .eq("id", resource.subject_id)
      .single();

  await supabase
    .from("subjects")
    .update({
      resource_count: Math.max(
        (subject?.resource_count || 1) - 1,
        0
      ),
    })
    .eq(
      "id",
      resource.subject_id
    );

}

    const {
  data: { session },
} = await supabase.auth.getSession();

if (session?.user?.email) {

  const { data: faculty } =
    await supabase

      .from("faculties")

      .select("id, uploads_count")

      .eq(
        "email",
        session.user.email
      )

      .single();

  if (faculty) {

    await supabase

      .from("faculties")

      .update({
        uploads_count:
          Math.max(
            0,
            (faculty.uploads_count || 1) - 1
          ),
      })

      .eq(
        "id",
        faculty.id
      );
  }
}

    router.push("/dashboard");
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

      <section className="p-8">

        <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-sm">

          <h1 className="mb-8 text-4xl font-bold">

            Manage Resource

          </h1>

          {resource?.thumbnail_url && (

            <img
              src={resource.thumbnail_url}
              alt={resource.title}
              className="mb-8 h-64 w-full rounded-2xl object-cover"
            />

          )}

          <div className="space-y-6">

            <div>

              <label className="mb-2 block font-semibold">

                Title

              </label>

              <input
                type="text"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                className="w-full rounded-xl border p-4"
              />

            </div>

            <div>

              <label className="mb-2 block font-semibold">

                Description

              </label>

              <textarea
                rows={5}
                value={description}
                onChange={(e) =>
                  setDescription(
                    e.target.value
                  )
                }
                className="w-full rounded-xl border p-4"
              />

            </div>

            <div>

              <label className="mb-2 block font-semibold">

                Resource Type

              </label>

              <input
                type="text"
                value={resourceType}
                onChange={(e) =>
                  setResourceType(
                    e.target.value
                  )
                }
                className="w-full rounded-xl border p-4"
              />

            </div>

            <div>

              <label className="mb-2 block font-semibold">

                Semester

              </label>

              <input
                type="text"
                value={semester}
                onChange={(e) =>
                  setSemester(
                    e.target.value
                  )
                }
                className="w-full rounded-xl border p-4"
              />

            </div>

            <div>

              <label className="mb-2 block font-semibold">

                Tags

              </label>

              <input
                type="text"
                value={tags}
                onChange={(e) =>
                  setTags(
                    e.target.value
                  )
                }
                className="w-full rounded-xl border p-4"
              />

            </div>

            <div className="rounded-2xl bg-gray-50 p-5">

              <p>

                <strong>
                  Subject:
                </strong>{" "}

                {resource.subject_name}

              </p>

              <p>

                <strong>
                  College:
                </strong>{" "}

                {resource.college_name}

              </p>

              <p>

                <strong>
                  Faculty:
                </strong>{" "}

                {resource.faculty_name}

              </p>

              <p>

                <strong>
                  Downloads:
                </strong>{" "}

                {resource.downloads}

              </p>

              <p>

                <strong>
                  Views:
                </strong>{" "}

                {resource.views}

              </p>

              <p>

                <strong>
                  Rating:
                </strong>{" "}

                {resource.rating}

              </p>

            </div>

            <div className="flex gap-4">

              <button
                onClick={
                  handleUpdate
                }
                disabled={saving}
                className="rounded-xl bg-[#355E3B] px-8 py-3 font-semibold text-white"
              >

                {saving
                  ? "Saving..."
                  : "Update Resource"}

              </button>

              <button
                onClick={
                  handleDelete
                }
                className="rounded-xl bg-red-600 px-8 py-3 font-semibold text-white"
              >

                Delete Resource

              </button>

            </div>

          </div>

        </div>

      </section>

    </FacultyLayout>
  );
}