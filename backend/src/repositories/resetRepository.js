import { supabaseAdmin } from "../config/supabase.js";
import { unwrapSupabaseResult } from "./databaseRepository.js";

export async function resetDemoData() {
  const result = await supabaseAdmin.rpc("reset_demo");
  unwrapSupabaseResult(result, "reset demo data");
}
