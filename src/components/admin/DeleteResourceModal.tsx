"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { AlertTriangle, Trash2, X } from "lucide-react";

interface Props {
  open: boolean;
  resource: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DeleteResourceModal({
  open,
  resource,
  onClose,
  onSuccess,
}: Props) {

  const [loading, setLoading] =
    useState(false);

   
async function deleteResource() {

  if (!resource) return;

  setLoading(true);

  try {

    // Delete Resource File
    if (resource.imagekit_file_id) {

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

      if (!response.ok) {

        alert(
          "Failed to delete the resource file from ImageKit."
        );

        setLoading(false);

        return;

      }

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

      if (!response.ok) {

        alert(
          "Failed to delete the thumbnail from ImageKit."
        );

        setLoading(false);

        return;

      }

    }

    // Delete from Supabase

    const { error } =
      await supabase
        .from("resources")
        .delete()
        .eq(
          "id",
          resource.id
        );

    if (error) {

      alert(
        error.message
      );

      setLoading(false);

      return;

    }

    alert(
      "Resource deleted successfully."
    );

    onSuccess();

    onClose();

  } catch (err) {

    console.log(err);

    alert(
      "Something went wrong while deleting the resource."
    );

  } finally {

    setLoading(false);

  }

}
   
  if (!open || !resource)
    return null;

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b p-6">

          <div className="flex items-center gap-3">

            <div className="rounded-full bg-red-100 p-3">

              <AlertTriangle
                size={28}
                className="text-red-600"
              />

            </div>

            <div>

              <h2 className="text-2xl font-bold text-red-600">
                Delete Resource
              </h2>

              <p className="text-sm text-gray-500">
                This action cannot be undone.
              </p>

            </div>

          </div>

          <button
            onClick={onClose}
          >
            <X size={24}/>
          </button>

        </div>

        {/* Body */}

        <div className="space-y-6 p-6">

          <div className="rounded-2xl border border-red-200 bg-red-50 p-5">

            <h3 className="text-lg font-bold">
              {resource.title}
            </h3>

            <p className="mt-3 text-gray-600">

              Faculty :
              {" "}
              {resource.faculty_name}

            </p>

            <p className="text-gray-600">

              Subject :
              {" "}
              {resource.subject_name}

            </p>

            <p className="text-gray-600">

              College :
              {" "}
              {resource.college_name}

            </p>

          </div>

          <div className="rounded-xl bg-yellow-50 p-4 text-sm text-yellow-700">

            ⚠ Deleting this resource will permanently remove it from the database.

          </div>

        </div>

        {/* Footer */}

        <div className="flex justify-end gap-4 border-t p-6">

          <button
            onClick={onClose}
            className="rounded-xl border px-6 py-3"
          >
            Cancel
          </button>

          <button
            onClick={deleteResource}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-white hover:bg-red-700 disabled:opacity-60"
          >

            <Trash2 size={18} />

            {loading
              ? "Deleting..."
              : "Delete Resource"}

          </button>

        </div>

      </div>

    </div>

  );

}