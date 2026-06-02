"use client";

import { useState } from "react";
import Link from "next/link";

import AppLayout from "@/components/AppLayout";

import { supabase } from "@/lib/supabase";
import { useEffect } from "react";

import { Search, Building2 } from "lucide-react";



export default function CollegesPage() {
  const [searchTerm, setSearchTerm] = useState("");

const [colleges, setColleges] = useState<any[]>([]);

useEffect(() => {
  loadColleges();
}, []);

const loadColleges = async () => {
  const { data, error } = await supabase
    .from("colleges")
    .select("*")
    .order("resource_count", { ascending: false });

  if (!error && data) {
    setColleges(data);
  }
};

  const filteredColleges = colleges.filter(
  (college) =>
    college.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase()) ||

    college.code
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase())
);

  return (
    <AppLayout>
      <section className="px-6 py-16">
        
        <div className="mx-auto max-w-7xl">
          
          {/* Header */}
          <div className="mb-12">
            
            <h1 className="text-5xl font-bold text-[#1F2937]">
              Colleges
            </h1>

            <p className="mt-4 max-w-2xl text-lg text-gray-600">
              Explore academic resources shared by
              faculties from top colleges and
              universities.
            </p>
          </div>

          {/* Search */}
          <div className="mb-12 flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm">
            
            <Search
              className="text-gray-500"
              size={24}
            />

            <input
              type="text"
              placeholder="Search colleges..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              className="w-full bg-transparent text-lg outline-none placeholder:text-gray-400"
            />
          </div>

          {/* Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            
            {filteredColleges.map((college) => (
              <div
  key={college.id}
  className="group flex flex-col rounded-3xl bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
>
                
                {/* Icon */}
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#355E3B] text-white">
                  
                  <Building2 size={38} />
                </div>

                {/* Content */}
                <div className="mt-8 flex-grow">
                  
                  <h2 className="break-words text-2xl font-bold text-[#1F2937]">
                    {college.name}
                  </h2>

                  <p className="mt-2 text-gray-500">
                    {college.code}
                  </p>

                  <p className="mt-5 text-sm font-medium text-[#355E3B]">
  {college.resource_count || 0} Resources
</p>
                </div>

                {/* Button */}
                <Link
  href={`/colleges/${college.id}`}
  className="mt-8 block w-full rounded-2xl bg-[#355E3B] py-4 text-center text-lg font-medium text-white transition-all duration-300 hover:bg-[#2d4f32]"
>
  Explore College
</Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AppLayout>
  );
}