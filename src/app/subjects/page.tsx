"use client";

import { useState } from "react";

import AppLayout from "@/components/AppLayout";

import {
  Search,
  BookOpen,
} from "lucide-react";

const subjects = [
  {
    name: "Database Management Systems",
    short: "DBMS",
    semester: "Semester 4",
    resources: "2.4K Resources",
  },

  {
    name: "Operating Systems",
    short: "OS",
    semester: "Semester 4",
    resources: "1.9K Resources",
  },

  {
    name: "Computer Networks",
    short: "CN",
    semester: "Semester 5",
    resources: "2.1K Resources",
  },

  {
    name: "Java Programming",
    short: "JAVA",
    semester: "Semester 3",
    resources: "1.7K Resources",
  },

  {
    name: "Data Structures",
    short: "DSA",
    semester: "Semester 3",
    resources: "3.2K Resources",
  },

  {
    name: "Cloud Computing",
    short: "CC",
    semester: "Semester 6",
    resources: "1.1K Resources",
  },
];

export default function SubjectsPage() {
  const [searchTerm, setSearchTerm] =
    useState("");

  const filteredSubjects = subjects.filter(
    (subject) =>
      subject.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||

      subject.short
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
              Subjects
            </h1>

            <p className="mt-4 max-w-2xl text-lg text-gray-600">
              Browse academic subjects and access
              notes, PDFs, and previous question
              papers shared by faculties.
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
              placeholder="Search subjects..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              className="w-full bg-transparent text-lg outline-none placeholder:text-gray-400"
            />
          </div>

          {/* Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            
            {filteredSubjects.map((subject) => (
              <div
                key={subject.short}
                className="group rounded-3xl bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                
                {/* Icon */}
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#355E3B] text-white">
                  
                  <BookOpen size={38} />
                </div>

                {/* Content */}
                <div className="mt-8">
                  
                  <h2 className="text-2xl font-bold text-[#1F2937]">
                    {subject.name}
                  </h2>

                  <p className="mt-2 text-gray-500">
                    {subject.short}
                  </p>

                  <div className="mt-5 flex items-center justify-between">
                    
                    <span className="rounded-full bg-[#DCE3CC] px-4 py-2 text-sm font-medium text-[#355E3B]">
                      {subject.semester}
                    </span>

                    <span className="text-sm font-medium text-[#355E3B]">
                      {subject.resources}
                    </span>
                  </div>
                </div>

                {/* Button */}
                <button className="mt-8 w-full rounded-2xl bg-[#355E3B] py-4 text-lg font-medium text-white transition-all duration-300 hover:bg-[#2d4f32]">
                  Explore Subject
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AppLayout>
  );
}