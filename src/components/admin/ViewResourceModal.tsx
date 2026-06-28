"use client";

import {
  X,
  Download,
  Eye,
  Star,
  Calendar,
  BookOpen,
  GraduationCap,
  School,
  Tag,
  ExternalLink,
} from "lucide-react";

interface Props {
  open: boolean;
  resource: any;
  onClose: () => void;
}

export default function ViewResourceModal({
  open,
  resource,
  onClose,
}: Props) {
  if (!open || !resource) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      <div className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white shadow-2xl">

        {/* Header */}

        <div className="sticky top-0 flex items-center justify-between border-b bg-white px-8 py-5">

          <h2 className="text-3xl font-bold text-[#355E3B]">
            Resource Details
          </h2>

          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-100"
          >
            <X size={26} />
          </button>

        </div>

        <div className="grid gap-10 p-8 lg:grid-cols-2">

          {/* Left */}

          <div>

            <img
              src={
                resource.thumbnail_url ||
                "/placeholder.png"
              }
              alt={resource.title}
              className="h-72 w-full rounded-2xl object-cover shadow"
            />

            <a
              href={resource.file_url}
              target="_blank"
              className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl bg-[#355E3B] px-6 py-4 text-lg font-semibold text-white transition hover:bg-[#2d4f32]"
            >
              <ExternalLink size={22} />
              Open Resource
            </a>

          </div>

          {/* Right */}

          <div>

            <h1 className="text-4xl font-bold text-gray-900">
              {resource.title}
            </h1>

            <p className="mt-6 whitespace-pre-line text-lg leading-8 text-gray-600">
              {resource.description}
            </p>

            <div className="mt-8 grid gap-4">

              <InfoRow
                icon={<GraduationCap size={20} />}
                label="Faculty"
                value={resource.faculty_name}
              />

              <InfoRow
                icon={<School size={20} />}
                label="College"
                value={resource.college_name}
              />

              <InfoRow
                icon={<BookOpen size={20} />}
                label="Subject"
                value={resource.subject_name}
              />

              <InfoRow
                icon={<Calendar size={20} />}
                label="Semester"
                value={resource.semester}
              />

              <InfoRow
                icon={<Tag size={20} />}
                label="Resource Type"
                value={resource.resource_type}
              />

            </div>

            {/* Tags */}

            <div className="mt-8">

              <h3 className="mb-3 text-lg font-semibold">
                Tags
              </h3>

              <div className="flex flex-wrap gap-2">

                {(resource.tags || []).map(
                  (tag: string) => (
                    <span
                      key={tag}
                      className="rounded-full bg-[#E7F0E8] px-4 py-2 text-sm font-medium text-[#355E3B]"
                    >
                      {tag}
                    </span>
                  )
                )}

              </div>

            </div>

            {/* Stats */}

            <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-4">

              <StatCard
                icon={<Download size={22} />}
                title="Downloads"
                value={resource.downloads || 0}
              />

              <StatCard
                icon={<Eye size={22} />}
                title="Views"
                value={resource.views || 0}
              />

              <StatCard
                icon={<Star size={22} />}
                title="Rating"
                value={resource.rating || 0}
              />

              <StatCard
                icon={<Calendar size={22} />}
                title="Uploaded"
                value={
                  resource.created_at
                    ? new Date(
                        resource.created_at
                      ).toLocaleDateString()
                    : "-"
                }
              />

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: any) {
  return (
    <div className="flex items-center gap-4 rounded-xl border p-4">

      <div className="text-[#355E3B]">
        {icon}
      </div>

      <div>

        <p className="text-sm text-gray-500">
          {label}
        </p>

        <h3 className="font-semibold">
          {value || "-"}
        </h3>

      </div>

    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
}: any) {
  return (
    <div className="rounded-2xl border p-5 text-center">

      <div className="mb-3 flex justify-center text-[#355E3B]">
        {icon}
      </div>

      <h3 className="text-2xl font-bold">
        {value}
      </h3>

      <p className="mt-1 text-sm text-gray-500">
        {title}
      </p>

    </div>
  );
}