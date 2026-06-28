"use client";

import {
  Building2,
  BookOpen,
  GraduationCap,
  FileText,
  Download,
  Eye,
  Star,
  Clock,
} from "lucide-react";

interface Props {
  stats: {
    colleges: number;
    subjects: number;
    faculties: number;
    resources: number;
    downloads: number;
    views: number;
    rating: number;
    pendingFaculty: number;
  };
}

const cards = [
  {
    key: "colleges",
    title: "Colleges",
    icon: Building2,
  },
  {
    key: "subjects",
    title: "Subjects",
    icon: BookOpen,
  },
  {
    key: "faculties",
    title: "Faculties",
    icon: GraduationCap,
  },
  {
    key: "resources",
    title: "Resources",
    icon: FileText,
  },
  {
    key: "downloads",
    title: "Downloads",
    icon: Download,
  },
  {
    key: "views",
    title: "Views",
    icon: Eye,
  },
  {
    key: "rating",
    title: "Average Rating",
    icon: Star,
  },
  {
    key: "pendingFaculty",
    title: "Pending Faculty",
    icon: Clock,
  },
];

export default function AnalyticsCards({
  stats,
}: Props) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.key}
            className="rounded-2xl bg-white p-6 shadow"
          >
            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-gray-500">
                  {card.title}
                </p>

                <h2 className="mt-2 text-3xl font-bold text-[#355E3B]">
                  {
                    stats[
                      card.key as keyof typeof stats
                    ]
                  }
                </h2>

              </div>

              <div className="rounded-xl bg-[#E7F0E8] p-3">

                <Icon
                  size={28}
                  className="text-[#355E3B]"
                />

              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
}