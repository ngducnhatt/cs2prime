import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Biến lưu trữ client để tái sử dụng (Singleton)
let cachedClient: SupabaseClient | null = null;

export const getSupabaseClient = () => {
	// Nếu đã có client trong cache, trả về ngay
	if (cachedClient) return cachedClient;

	const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

	if (!url || !key) {
		console.warn(
			"[supabase] Env missing: Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.",
		);
		return null;
	}

	// Tạo client mới và lưu vào cache
	try {
		cachedClient = createClient(url, key, {
			auth: {
				persistSession: false, // Tối ưu cho public data fetching
			},
		});
	} catch (error) {
		console.error("[supabase] Failed to create client:", error);
		return null;
	}

	return cachedClient;
};
