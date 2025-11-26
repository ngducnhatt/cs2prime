import { createClient, SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

const getEnv = () => {
	const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
	if (!url || !key) {
		console.warn(
			"[supabase] Env missing: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
		);
		return null;
	}
	return { url, key };
};

export const getSupabaseClient = () => {
	if (cached) return cached;
	const env = getEnv();
	if (!env) return null;
	cached = createClient(env.url, env.key, {
		auth: { persistSession: false },
	});
	return cached;
};
