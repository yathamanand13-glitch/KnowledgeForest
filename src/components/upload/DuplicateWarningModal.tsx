"use client";

import {
  AlertTriangle,
  FileText,
  GraduationCap,
  School,
  Calendar,
  X,
  Eye,
} from "lucide-react";

interface Props {
  open: boolean;
  duplicate: any;
  onCancel: () => void;
  onContinue: () => void;
}

export default function DuplicateWarningModal({
  open,
  duplicate,
  onCancel,
  onContinue,
}: Props) {

  if (!open || !duplicate) return null;

  const resource =
    duplicate.matchedResource;

  return (

    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">

      <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b p-6">

          <div className="flex items-center gap-4">

            <div className="rounded-full bg-yellow-100 p-3">

              <AlertTriangle
                size={28}
                className="text-yellow-600"
              />

            </div>

            <div>

              <h2 className="text-2xl font-bold">

                Possible Duplicate Detected

              </h2>

              <p className="text-sm text-gray-500">

                A similar resource already exists.

              </p>

            </div>

          </div>

          <button
            onClick={onCancel}
          >
            <X size={24} />
          </button>

        </div>

        {/* Body */}

        <div className="space-y-6 p-6">

          <div className="rounded-2xl bg-yellow-50 p-5">

            <div className="mb-3 flex items-center justify-between">

              <span className="font-semibold">

                Similarity Score

              </span>

              <span className="rounded-full bg-yellow-500 px-4 py-2 font-bold text-white">

                {duplicate.score}%

              </span>

            </div>

            <div className="h-3 overflow-hidden rounded-full bg-yellow-200">

              <div

                style={{
                  width: `${duplicate.score}%`,
                }}

                className="h-full bg-yellow-500"

              />

            </div>

          </div>

          {/* Existing Resource */}

          <div className="rounded-2xl border p-5">

            <h3 className="mb-5 text-xl font-bold">

              Existing Resource

            </h3>

            <div className="space-y-4">

              <InfoRow
                icon={<FileText size={18} />}
                label="Title"
                value={resource.title}
              />

              <InfoRow
                icon={<GraduationCap size={18} />}
                label="Faculty"
                value={resource.faculty_name}
              />

              <InfoRow
                icon={<School size={18} />}
                label="College"
                value={resource.college_name}
              />

              <InfoRow
                icon={<Calendar size={18} />}
                label="Semester"
                value={resource.semester}
              />

            </div>

          </div>

          <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">

            Continuing may create duplicate resources for the same college and subject.

          </div>

        </div>

        {/* Footer */}

        <div className="flex flex-wrap justify-end gap-4 border-t p-6">

          <button

            onClick={onCancel}

            className="rounded-xl border px-6 py-3"

          >

            Cancel Upload

          </button>

          <button

            onClick={() => {

              window.open(
                resource.file_url,
                "_blank"
              );

            }}

            className="flex items-center gap-2 rounded-xl border border-[#355E3B] px-6 py-3 text-[#355E3B]"

          >

            <Eye size={18} />

            View Existing

          </button>

          <button

            onClick={onContinue}

            className="rounded-xl bg-[#355E3B] px-6 py-3 font-semibold text-white"

          >

            Continue Anyway

          </button>

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

    <div className="flex items-center gap-4">

      <div className="text-[#355E3B]">

        {icon}

      </div>

      <div>

        <p className="text-sm text-gray-500">

          {label}

        </p>

        <h4 className="font-semibold">

          {value || "-"}

        </h4>

      </div>

    </div>

  );

}