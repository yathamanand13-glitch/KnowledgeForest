"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import Link from "next/link";

import AppLayout from "@/components/AppLayout";

import { supabase } from "@/lib/supabase";

import {
  Search,
  Download,
  Eye,
} from "lucide-react";

interface Resource {

  id: string;

  title: string;

  description: string;

  resource_type: string;

  semester: string;

  file_url: string;

  thumbnail_url: string;

  created_at: string;

  subject_id: string | null;

  college_id: string | null;

  uploaded_by: string | null;

  subject_name?: string;

  college_name?: string;

  faculty_name?: string;

  rating?: number;
}

export default function ResourcesPage() {

  const [resources, setResources] =
    useState<Resource[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [searchTerm, setSearchTerm] =
    useState("");

    const searchParams = useSearchParams();

const collegeId =
  searchParams.get("college");

 useEffect(() => {
  fetchResources();
}, [collegeId]);

 async function fetchResources() {

  setLoading(true);

 let query = supabase
  .from("resources")
  .select("*");

if (collegeId) {
  query = query.eq(
    "college_id",
    collegeId
  );
}

const {
  data: resourcesData,
  error,
} = await query;

  if (error) {

    console.log(error);

    setLoading(false);

    return;
  }

  console.log(resourcesData);

  setResources(resourcesData || []);

  setLoading(false);
}

  const filteredResources =
    resources.filter((resource) => {

      const search =
        searchTerm.toLowerCase();

      return (

        resource.title
          ?.toLowerCase()
          .includes(search) ||

        resource.subject_name
          ?.toLowerCase()
          .includes(search) ||

        resource.college_name
          ?.toLowerCase()
          .includes(search) ||

        resource.faculty_name
          ?.toLowerCase()
          .includes(search) ||

        resource.resource_type
          ?.toLowerCase()
          .includes(search)

      );

    });

  return (

    <AppLayout>

      <section className="px-6 py-16">

        <div className="mx-auto max-w-7xl">

          {/* HEADER */}

          <div className="mb-12">

            <h1 className="text-5xl font-bold text-[#1F2937]">

              Resources

            </h1>

            <p className="mt-4 max-w-2xl text-lg text-gray-600">

              Access academic notes,
              PDFs, previous question
              papers and learning
              materials uploaded by
              faculties.

            </p>

          </div>

          {/* SEARCH */}

          <div className="mb-12 flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm">

            <Search
              className="text-gray-500"
              size={24}
            />

            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(
                  e.target.value
                )
              }
              className="w-full bg-transparent text-lg outline-none placeholder:text-gray-400"
            />

          </div>

          {/* LOADING */}

          {loading && (

            <div className="text-center text-lg font-semibold text-gray-500">

              Loading resources...

            </div>

          )}

          {/* EMPTY */}

          {!loading &&
            filteredResources.length === 0 && (

            <div className="text-center text-lg font-semibold text-gray-500">

              No resources found.

            </div>

          )}

          {/* GRID */}

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            {filteredResources.map(
              (resource) => (

              <div
                key={resource.id}
                className="group overflow-hidden rounded-3xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >

                {/* IMAGE */}

                <div className="h-56 w-full overflow-hidden bg-[#EEF2E6]">

                  <img
                    src={
                      resource.thumbnail_url
                    }
                    alt={resource.title}
                    className="h-full w-full object-cover"
                  />

                </div>

                {/* CONTENT */}

                <div className="p-6">

                  <h2 className="line-clamp-2 text-2xl font-bold text-[#1F2937]">

                    {resource.title}

                  </h2>

                   <div className="mt-2 flex items-center gap-2">
  <div>
    {[1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        className={
          star <= Math.round(resource.rating || 0)
            ? "text-yellow-500"
            : "text-gray-300"
        }
      >
        ★
      </span>
    ))}
  </div>

  <span className="text-sm font-medium text-gray-600">
    {Number(resource.rating || 0).toFixed(1)}
  </span>
</div>


                  <p className="mt-3 line-clamp-2 text-sm text-gray-600">

                    {resource.description}

                  </p>

                 
                  {/* TAGS */}

                  <div className="mt-4 flex flex-wrap gap-2">

                    <span className="rounded-full bg-[#DCE3CC] px-4 py-2 text-sm font-medium text-[#355E3B]">

                      {resource.subject_name}

                    </span>

                    <span className="rounded-full bg-[#EEF2E6] px-4 py-2 text-sm font-medium text-[#355E3B]">

                      {resource.resource_type}

                    </span>

                  </div>

                  {/* META */}

                  <div className="mt-5 space-y-2 text-sm text-gray-500">

                    <p>

                      🎓 {resource.college_name}

                    </p>

                    <p>

                      👨‍🏫 {resource.faculty_name}

                    </p>

                    <p>

                      📚 {resource.semester}

                    </p>

                  </div>

                  {/* BUTTONS */}

                  <div className="mt-8 flex gap-4">

                    <Link
                      href={`/resources/${resource.id}`}
                      className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-[#355E3B] py-4 font-medium text-[#355E3B] transition hover:bg-[#EEF2E6]"
                    >

                      <Eye size={20} />

                      Preview

                    </Link>

                    <a
                      href={resource.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#355E3B] py-4 font-medium text-white transition hover:bg-[#2d4f32]"
                    >

                      <Download size={20} />

                      Download

                    </a>

                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>

    </AppLayout>
  );
}