"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { X } from "lucide-react";

interface Props {
  open: boolean;
  resource: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditResourceModal({
  open,
  resource,
  onClose,
  onSuccess,
}: Props) {

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] =
    useState({
      title: "",
      description: "",
      faculty_name: "",
      college_name: "",
      subject_name: "",
      semester: "",
      resource_type: "",
      status: "",
      approval_status: "",
      tags: "",
    });

  useEffect(() => {

    if (resource) {

      setForm({

        title:
          resource.title || "",

        description:
          resource.description || "",

        faculty_name:
          resource.faculty_name || "",

        college_name:
          resource.college_name || "",

        subject_name:
          resource.subject_name || "",

        semester:
          resource.semester || "",

        resource_type:
          resource.resource_type || "",

        status:
          resource.status || "",

        approval_status:
          resource.approval_status || "",

        tags:
          Array.isArray(resource.tags)
            ? resource.tags.join(", ")
            : "",

      });

    }

  }, [resource]);

  async function updateResource() {

    setLoading(true);

    const { error } =
      await supabase
        .from("resources")
        .update({

          title:
            form.title,

          description:
            form.description,

          faculty_name:
            form.faculty_name,

          college_name:
            form.college_name,

          subject_name:
            form.subject_name,

          semester:
            form.semester,

          resource_type:
            form.resource_type,

          status:
            form.status,

          approval_status:
            form.approval_status,

          tags:
            form.tags
              .split(",")
              .map(tag => tag.trim())
              .filter(Boolean),

        })
        .eq("id", resource.id);

    setLoading(false);

    if (error) {

      alert(error.message);

      return;

    }

    onSuccess();

    onClose();

  }

  if (!open || !resource)
    return null;

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl">

        {/* Header */}

        <div className="sticky top-0 flex items-center justify-between border-b bg-white p-6">

          <h2 className="text-3xl font-bold text-[#355E3B]">
            Edit Resource
          </h2>

          <button
            onClick={onClose}
          >
            <X size={28}/>
          </button>

        </div>

        <div className="grid gap-5 p-8">

          <input
            value={form.title}
            onChange={(e)=>
              setForm({
                ...form,
                title:e.target.value
              })
            }
            placeholder="Title"
            className="rounded-xl border p-3"
          />

          <textarea
            rows={5}
            value={form.description}
            onChange={(e)=>
              setForm({
                ...form,
                description:e.target.value
              })
            }
            placeholder="Description"
            className="rounded-xl border p-3"
          />

          <div className="grid gap-4 md:grid-cols-2">

            <input
              value={form.faculty_name}
              onChange={(e)=>
                setForm({
                  ...form,
                  faculty_name:e.target.value
                })
              }
              placeholder="Faculty"
              className="rounded-xl border p-3"
            />

            <input
              value={form.college_name}
              onChange={(e)=>
                setForm({
                  ...form,
                  college_name:e.target.value
                })
              }
              placeholder="College"
              className="rounded-xl border p-3"
            />

            <input
              value={form.subject_name}
              onChange={(e)=>
                setForm({
                  ...form,
                  subject_name:e.target.value
                })
              }
              placeholder="Subject"
              className="rounded-xl border p-3"
            />

            <input
              value={form.semester}
              onChange={(e)=>
                setForm({
                  ...form,
                  semester:e.target.value
                })
              }
              placeholder="Semester"
              className="rounded-xl border p-3"
            />

            <input
              value={form.resource_type}
              onChange={(e)=>
                setForm({
                  ...form,
                  resource_type:e.target.value
                })
              }
              placeholder="Resource Type"
              className="rounded-xl border p-3"
            />

            <input
              value={form.tags}
              onChange={(e)=>
                setForm({
                  ...form,
                  tags:e.target.value
                })
              }
              placeholder="Tags"
              className="rounded-xl border p-3"
            />

          </div>

          <div className="grid gap-4 md:grid-cols-2">

            <select
              value={form.status}
              onChange={(e)=>
                setForm({
                  ...form,
                  status:e.target.value
                })
              }
              className="rounded-xl border p-3"
            >

              <option value="approved">
                Approved
              </option>

              <option value="inactive">
                Inactive
              </option>

            </select>

            <select
              value={form.approval_status}
              onChange={(e)=>
                setForm({
                  ...form,
                  approval_status:e.target.value
                })
              }
              className="rounded-xl border p-3"
            >

              <option value="approved">
                Approved
              </option>

              <option value="pending">
                Pending
              </option>

              <option value="rejected">
                Rejected
              </option>

            </select>

          </div>

        </div>

        <div className="flex justify-end gap-4 border-t p-6">

          <button
            onClick={onClose}
            className="rounded-xl border px-6 py-3"
          >
            Cancel
          </button>

          <button
            onClick={updateResource}
            disabled={loading}
            className="rounded-xl bg-[#355E3B] px-6 py-3 text-white"
          >
            {loading
              ? "Updating..."
              : "Update Resource"}
          </button>

        </div>

      </div>

    </div>

  );

}