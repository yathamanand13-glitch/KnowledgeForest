import natural from "natural";

import { supabase } from "@/lib/supabase";

import { normalizeTitle } from "@/utils/normalizeTitle";

const tokenizer = new natural.WordTokenizer();

export interface DuplicateResult {

  duplicate: boolean;

  score: number;

  matchedResource: any | null;

  reason: string;

}

export async function detectDuplicate({

  title,

  collegeId,

  subjectId,

  semester,

  resourceType,

}: {

  title: string;

  collegeId: string;

  subjectId: string;

  semester: string;

  resourceType: string;

}): Promise<DuplicateResult> {

  const normalizedTitle =
    normalizeTitle(title);

  const { data } =
    await supabase

      .from("resources")

      .select("*")

      .eq("college_id", collegeId)

      .eq("subject_id", subjectId)

      .eq("semester", semester)

      .eq("resource_type", resourceType)

      .eq("status", "approved");

  if (!data?.length) {

    return {

      duplicate: false,

      score: 0,

      matchedResource: null,

      reason: "",

    };

  }

  let bestScore = 0;

  let bestMatch: any = null;

  for (const resource of data) {

    const existingTitle =
      normalizeTitle(resource.title);

    const score =

      natural.JaroWinklerDistance(

        normalizedTitle,

        existingTitle

      ) * 100;

    if (score > bestScore) {

      bestScore = score;

      bestMatch = resource;

    }

  }

  return {

    duplicate: bestScore >= 85,

    score: Number(
      bestScore.toFixed(1)
    ),

    matchedResource: bestMatch,

    reason:
      bestScore >= 85
        ? "Title Similarity"
        : "",

  };

}