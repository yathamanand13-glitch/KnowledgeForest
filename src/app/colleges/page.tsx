"use client";

import { useState } from "react";

import AppLayout from "@/components/AppLayout";

import { Search, Building2 } from "lucide-react";

const colleges = [
  {
    name: "JNTU Hyderabad",
    code: "JNTUH",
    resources: "12K+ Resources",
  },

  {
    name: "VTU Karnataka",
    code: "VTU",
    resources: "9K+ Resources",
  },

  {
    name: "Osmania University",
    code: "OU",
    resources: "7K+ Resources",
  },

  {
    name: "Anna University",
    code: "AU",
    resources: "10K+ Resources",
  },

  {
    name: "IIT Hyderabad",
    code: "IITH",
    resources: "18K+ Resources",
  },

  {
    name: "BITS Pilani",
    code: "BITS",
    resources: "14K+ Resources",
  },
];

export default function CollegesPage() {
  const [searchTerm, setSearchTerm] =
    useState("");

  const filteredColleges = colleges.filter(
    (college) =>
      college.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||

      college.code
        .toLowerCase()
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
                key={college.code}
                className="group rounded-3xl bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                
                {/* Icon */}
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#355E3B] text-white">
                  
                  <Building2 size={38} />
                </div>

                {/* Content */}
                <div className="mt-8">
                  
                  <h2 className="text-2xl font-bold text-[#1F2937]">
                    {college.name}
                  </h2>

                  <p className="mt-2 text-gray-500">
                    {college.code}
                  </p>

                  <p className="mt-5 text-sm font-medium text-[#355E3B]">
                    {college.resources}
                  </p>
                </div>

                {/* Button */}
                <button className="mt-8 w-full rounded-2xl bg-[#355E3B] py-4 text-lg font-medium text-white transition-all duration-300 hover:bg-[#2d4f32]">
                  Explore College
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AppLayout>
  );
}