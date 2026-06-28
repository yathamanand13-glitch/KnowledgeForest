"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminLayout from "@/components/admin/AdminLayout";
import ViewResourceModal from "@/components/admin/ViewResourceModal";
import EditResourceModal from "@/components/admin/EditResourceModal";
import DeleteResourceModal from "@/components/admin/DeleteResourceModal";

interface Resource {
  id: string;
  title: string;
  thumbnail_url: string;
  faculty_name: string;
  college_name: string;
  subject_name: string;
  semester: string;
  resource_type: string;
  downloads: number;
  views: number;
  created_at: string;
  imagekit_file_id: string | null;
  imagekit_thumbnail_id: string | null;
}

export default function AdminResourcesPage() {

  const [resources, setResources] =
    useState<Resource[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [currentPage, setCurrentPage] =
    useState(1);

    const [selectedResource, setSelectedResource] =
  useState<any>(null);

const [viewOpen, setViewOpen] =
  useState(false);

const [editOpen, setEditOpen] =
  useState(false);

const [deleteOpen, setDeleteOpen] =
  useState(false);

  const [
  selectedResources,
  setSelectedResources,
] = useState<string[]>([]);

  const itemsPerPage = 10;

  function toggleSelection(id: string) {

  setSelectedResources((prev) =>

    prev.includes(id)

      ? prev.filter(
          (item) => item !== id
        )

      : [...prev, id]

  );

}

function toggleSelectAll() {

  if (

    selectedResources.length ===
    paginatedResources.length

  ) {

    setSelectedResources([]);

  } else {

    setSelectedResources(

      paginatedResources.map(
        (resource) => resource.id
      )

    );

  }

}

async function deleteSelectedResources() {

  const confirmed = confirm(
    `Delete ${selectedResources.length} selected resource(s)?`
  );

  if (!confirmed) return;

  setLoading(true);

  let successCount = 0;

  let failedCount = 0;

  try {

    const resourcesToDelete =
      resources.filter((resource) =>
        selectedResources.includes(
          resource.id
        )
      );

    for (
      let i = 0;
      i < resourcesToDelete.length;
      i++
    ) {

      const resource =
        resourcesToDelete[i];

      console.log(
        `Deleting ${i + 1} of ${
          resourcesToDelete.length
        }`
      );

      try {

        // Delete Resource File

        if (
          resource.imagekit_file_id
        ) {

          const response =
            await fetch(
              "/api/imagekit/delete",
              {
                method: "POST",

                headers: {
                  "Content-Type":
                    "application/json",
                },

                body: JSON.stringify({
                  fileId:
                    resource.imagekit_file_id,
                }),
              }
            );

          if (!response.ok)
            throw new Error(
              "Failed to delete resource file."
            );

        }

        // Delete Thumbnail

        if (
          resource.imagekit_thumbnail_id
        ) {

          const response =
            await fetch(
              "/api/imagekit/delete",
              {
                method: "POST",

                headers: {
                  "Content-Type":
                    "application/json",
                },

                body: JSON.stringify({
                  fileId:
                    resource.imagekit_thumbnail_id,
                }),
              }
            );

          if (!response.ok)
            throw new Error(
              "Failed to delete thumbnail."
            );

        }

        // Delete Database Row

        const { error } =
          await supabase
            .from("resources")
            .delete()
            .eq(
              "id",
              resource.id
            );

        if (error)
          throw error;

        successCount++;

      } catch (err) {

        console.log(err);

        failedCount++;

      }

    }

    setSelectedResources([]);

    await loadResources();

    alert(

      `Bulk Delete Completed

Deleted : ${successCount}

Failed : ${failedCount}`

    );

  } finally {

    setLoading(false);

  }

}

  useEffect(() => {

    loadResources();

  }, []);

  async function loadResources() {

    setLoading(true);

    const { data } =
      await supabase
        .from("resources")
        .select("*")
        .order(
          "created_at",
          {
            ascending: false,
          }
        );

    setResources(data || []);

    setLoading(false);

  }

  const filteredResources =
    useMemo(() => {

      return resources.filter((resource) =>

        resource.title
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||

        resource.faculty_name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||

        resource.college_name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||

        resource.subject_name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )

      );

    }, [resources, search]);

  const totalPages =
    Math.ceil(
      filteredResources.length /
      itemsPerPage
    );

  const paginatedResources =
    filteredResources.slice(

      (currentPage - 1) *
      itemsPerPage,

      currentPage *
      itemsPerPage

    );

  return (

    <AdminLayout>

      <div>

        <div className="mb-8">

          <h1 className="text-5xl font-bold text-[#355E3B]">
            Resource Management
          </h1>

          <p className="mt-2 text-gray-500">
            Manage all uploaded resources
          </p>

        </div>

        {selectedResources.length > 0 && (

  <div className="mb-6 flex items-center justify-between rounded-2xl bg-[#355E3B] p-4 text-white">

    <h3 className="font-semibold">

      {selectedResources.length}

      {" "}

      Resources Selected

    </h3>

  <button

  onClick={deleteSelectedResources}
  disabled={loading}

  className="rounded-xl bg-red-600 px-5 py-2 hover:bg-red-700"

>

  {loading
  ? "Deleting..."
  : `Delete Selected (${selectedResources.length})`}

</button>

  </div>

)}

        <div className="mb-8">

          <input

            value={search}

            onChange={(e) => {

              setSearch(
                e.target.value
              );

              setCurrentPage(1);

            }}

            placeholder="Search resources..."

            className="w-full rounded-xl border bg-white px-4 py-3 md:w-96"

          />

        </div>

        {loading ? (

          <div className="rounded-3xl bg-white p-20 text-center shadow">

            Loading Resources...

          </div>

        ) : filteredResources.length === 0 ? (

          <div className="rounded-3xl bg-white p-20 text-center shadow">

            <h2 className="text-2xl font-bold">

              No Resources Found

            </h2>

          </div>

        ) : (

          <>

            {/* Desktop */}

            <div className="hidden overflow-x-auto rounded-3xl bg-white shadow lg:block">

              <table className="min-w-[1400px] w-full">

                <thead>

                  <tr className="border-b">

                   <th className="px-6 py-5">

  <input
    type="checkbox"

    checked={
      paginatedResources.length > 0 &&
      selectedResources.length ===
        paginatedResources.length
    }

    onChange={toggleSelectAll}

    className="h-5 w-5"

  />

</th>

<th className="text-left">

  Thumbnail

</th>

                    <th className="text-left">
                      Title
                    </th>

                    <th className="text-left">
                      Faculty
                    </th>

                    <th className="text-left">
                      College
                    </th>

                    <th className="text-left">
                      Subject
                    </th>

                    <th className="text-left">
                      Semester
                    </th>

                    <th className="text-left">
                      Type
                    </th>

                    <th className="text-left">
                      Downloads
                    </th>

                    <th className="text-left">
                      Views
                    </th>

                    <th className="text-left">
                      Uploaded
                    </th>

                    <th className="text-left">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {paginatedResources.map(
                    (resource) => (

                      <tr
                        key={resource.id}
                        className="border-b"
                      >

                       <td className="px-6">

  <input

    type="checkbox"

    checked={

      selectedResources.includes(
        resource.id
      )

    }

    onChange={() =>

      toggleSelection(
        resource.id
      )

    }

    className="h-5 w-5"

  />

</td>

                        <td className="px-6 py-4">

                          <img

                            src={
                              resource.thumbnail_url ||
                              "/placeholder.png"
                            }

                            className="h-16 w-24 rounded-lg object-cover"

                          />

                        </td>

                        <td>
                          {resource.title}
                        </td>

                        <td>
                          {resource.faculty_name}
                        </td>

                        <td>
                          {resource.college_name}
                        </td>

                        <td>
                          {resource.subject_name}
                        </td>

                        <td>
                          {resource.semester}
                        </td>

                        <td>

                          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">

                            {resource.resource_type}

                          </span>

                        </td>

                        <td>
                          {resource.downloads}
                        </td>

                        <td>
                          {resource.views}
                        </td>

                        <td>

                          {new Date(
                            resource.created_at
                          ).toLocaleDateString()}

                        </td>

                        <td>

                          <div className="flex gap-2">

<button
  onClick={() => {
    setSelectedResource(resource);
    setViewOpen(true);
  }}
  className="rounded-lg bg-green-600 px-3 py-2 text-white"
>
  View
</button>

<button
  onClick={() => {
    setSelectedResource(resource);
    setEditOpen(true);
  }}
  className="rounded-lg bg-blue-600 px-3 py-2 text-white"
>
  Edit
</button>

 <button
  onClick={() => {
    setSelectedResource(resource);
    setDeleteOpen(true);
  }}
  className="rounded-lg bg-red-600 px-3 py-2 text-white"
>
  Delete
</button>

                          </div>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

            {/* Mobile */}

            <div className="space-y-5 lg:hidden">

{paginatedResources.map((resource) => (

  <div
    key={resource.id}
    className="rounded-3xl bg-white p-5 shadow"
  >

    <div className="mb-4">

  <input

    type="checkbox"

    checked={

      selectedResources.includes(
        resource.id
      )

    }

    onChange={() =>

      toggleSelection(
        resource.id
      )

    }

    className="h-5 w-5"

  />

</div>

    <img
      src={
        resource.thumbnail_url ||
        "/placeholder.png"
      }
      className="mb-5 h-48 w-full rounded-xl object-cover"
    />

    <h2 className="text-2xl font-bold">
      {resource.title}
    </h2>

    <div className="mt-5 space-y-2 text-sm">

      <p>
        <span className="font-semibold">
          Faculty:
        </span>{" "}
        {resource.faculty_name}
      </p>

      <p>
        <span className="font-semibold">
          College:
        </span>{" "}
        {resource.college_name}
      </p>

      <p>
        <span className="font-semibold">
          Subject:
        </span>{" "}
        {resource.subject_name}
      </p>

      <p>
        <span className="font-semibold">
          Semester:
        </span>{" "}
        {resource.semester}
      </p>

      <p>
        <span className="font-semibold">
          Type:
        </span>{" "}

        <span className="rounded-full bg-blue-100 px-3 py-1 text-blue-700">

          {resource.resource_type}

        </span>

      </p>

    </div>

    <div className="mt-6 flex justify-between text-sm">

      <span>
        📥 {resource.downloads}
      </span>

      <span>
        👁 {resource.views}
      </span>

    </div>

    <div className="mt-6 space-y-3">

<button
  onClick={() => {
    setSelectedResource(resource);
    setViewOpen(true);
  }}
  className="w-full rounded-xl bg-green-600 py-3 text-white"
>
  View
</button>

<button
  onClick={() => {
    setSelectedResource(resource);
    setEditOpen(true);
  }}
  className="w-full rounded-xl bg-blue-600 py-3 text-white"
>
  Edit
</button>

<button
  onClick={() => {
    setSelectedResource(resource);
    setDeleteOpen(true);
  }}
  className="w-full rounded-xl bg-red-600 py-3 text-white"
>
  Delete
</button>

    </div>

  </div>

))}

            </div>

            <div className="mt-8 flex items-center justify-between">

              <p className="text-gray-500">

                Showing

                {" "}

                {paginatedResources.length}

                {" "}

                of

                {" "}

                {filteredResources.length}

                {" "}

                resources

              </p>

              <div className="flex gap-3">

                <button

                  disabled={
                    currentPage === 1
                  }

                  onClick={() =>
                    setCurrentPage(
                      currentPage - 1
                    )
                  }

                  className="rounded-lg border px-4 py-2 disabled:opacity-50"

                >

                  Previous

                </button>

                <span className="rounded-lg bg-[#355E3B] px-4 py-2 text-white">

                  {currentPage} / {totalPages}

                </span>

                <button

                  disabled={
                    currentPage === totalPages
                  }

                  onClick={() =>
                    setCurrentPage(
                      currentPage + 1
                    )
                  }

                  className="rounded-lg border px-4 py-2 disabled:opacity-50"

                >

                  Next

                </button>

              </div>

            </div>

          </>

        )}

      </div>

      <ViewResourceModal
  open={viewOpen}
  resource={selectedResource}
  onClose={() => {

    setViewOpen(false);

    setSelectedResource(null);

  }}
/>

<EditResourceModal
  open={editOpen}
  resource={selectedResource}
  onClose={() => {

    setEditOpen(false);

    setSelectedResource(null);

  }}
  onSuccess={loadResources}
/>

<DeleteResourceModal
  open={deleteOpen}
  resource={selectedResource}
  onClose={() => {

    setDeleteOpen(false);

    setSelectedResource(null);

  }}
  onSuccess={loadResources}
/>

    </AdminLayout>

  );

}