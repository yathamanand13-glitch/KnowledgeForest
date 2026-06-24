"use client";

export default function AdminHeader() {
  return (
    <header className="flex items-center justify-between border-b bg-white px-8 py-5">

      <div>

        <h2 className="text-2xl font-bold text-[#1F2937]">
          Admin Panel
        </h2>

        <p className="text-sm text-gray-500">
          Manage KnowledgeForest
        </p>

      </div>

      <div className="rounded-full bg-[#355E3B] px-5 py-2 text-white">
        Super Admin
      </div>

    </header>
  );
}