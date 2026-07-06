import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://zbsskdedckltxwppfelw.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_uiWh9gqycsYH6obyq8ndtw_7DN1dRo2";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);