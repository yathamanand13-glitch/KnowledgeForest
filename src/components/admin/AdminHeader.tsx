"use client";

import { Menu } from "lucide-react";

interface Props {

  onMenuClick: () => void;

}

export default function AdminHeader({
  onMenuClick,
}: Props) {

  return (

    <header className="flex items-center justify-between border-b bg-white px-4 py-5 lg:px-8">

      <div className="flex items-center gap-4">

        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 hover:bg-gray-100 lg:hidden"
        >

          <Menu size={26} />

        </button>

        <div>

          <h2 className="text-2xl font-bold text-[#1F2937]">

            Admin Panel

          </h2>

          <p className="text-sm text-gray-500">

            Manage KnowledgeForest

          </p>

        </div>

      </div>

      <div className="rounded-full bg-[#355E3B] px-5 py-2 text-white">

        Super Admin

      </div>

    </header>

  );

}