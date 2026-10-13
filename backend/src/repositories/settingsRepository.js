import { supabaseAdmin } from "../config/supabase.js";
import { TABLES } from "../constants/database.js";
import { unwrapSupabaseResult } from "./databaseRepository.js";

const WEIGHTS_KEY = "weights";
const TIME_OFFSET_KEY = "time_offset_hours";

export async function findWeights() {
  const result = await supabaseAdmin
    .from(TABLES.settings)
    .select("value")
    .eq("key", WEIGHTS_KEY)
    .single();

  return unwrapSupabaseResult(result, "read priority weights").value;
}

export async function saveWeights(weights) {
  const result = await supabaseAdmin
    .from(TABLES.settings)
    .upsert({ key: WEIGHTS_KEY, value: weights }, { onConflict: "key" })
    .select("value")
    .single();

  return unwrapSupabaseResult(result, "save priority weights").value;
}

export async function findTimeOffsetHours() {
  const result = await supabaseAdmin
    .from(TABLES.settings)
    .select("value")
    .eq("key", TIME_OFFSET_KEY)
    .single();

  const value = unwrapSupabaseResult(result, "read time offset").value;
  const hours = Number(value);
  return Number.isFinite(hours) ? hours : 0;
}
