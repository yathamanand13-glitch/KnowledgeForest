import { supabase }
from "@/lib/supabase";

export async function
requireAuth() {

  const {
    data: { session }
  } =
    await supabase.auth.getSession();

  return session;
}