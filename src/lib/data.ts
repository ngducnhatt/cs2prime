import { getSupabaseClient } from "./supabaseClient";
import type {
	Category,
	HeroSlide,
	Post,
	ProductListItem,
	ProductSource,
	ProductVariant,
	Service,
	Bank,
} from "./types";

// Helper chuyển đổi status từ số/string sang boolean
const toBooleanStatus = (value: unknown) => {
	if (typeof value === "boolean") return value;
	if (typeof value === "number") return value > 0;
	if (typeof value === "string")
		return value === "1" || value.toLowerCase() === "true";
	return true;
};

// --- API Calls ---

export const fetchBanks = async (): Promise<Bank[]> => {
	try {
		const response = await fetch("https://api.vietqr.io/v2/banks", {
			next: { revalidate: 86400 }, // Cache danh sách ngân hàng trong 24h
		});
		if (!response.ok) throw new Error("Failed to fetch banks");
		const result = await response.json();
		return result.data || [];
	} catch (err) {
		console.error("fetchBanks failed", err);
		return [];
	}
};

export const fetchHeroSections = async (): Promise<HeroSlide[]> => {
	const supabase = getSupabaseClient();
	if (!supabase) return [];

	try {
		const { data, error } = await supabase
			.from("hero_sections")
			.select(
				"title,subtitle,description,image,href,ctalabel,status,priority",
			)
			.eq("status", true)
			.order("priority", { ascending: true });

		if (error) {
			console.error("fetchHeroSections error:", error.message);
			return [];
		}

		return (data || []).map((row) => ({
			title: row.title?.trim() || "",
			subtitle: row.subtitle || "",
			description: row.description || "",
			image: row.image?.trim() || "",
			href: row.href?.trim() || "/",
			ctalabel: row.ctalabel?.trim() || "Mua ngay",
		}));
	} catch (err) {
		console.error("fetchHeroSections exception:", err);
		return [];
	}
};

export const fetchCategories = async (): Promise<Category[]> => {
	const supabase = getSupabaseClient();
	if (!supabase) return [];

	try {
		const { data, error } = await supabase
			.from("categories")
			.select("id,name,sold,image,description")
			.order("created_at");

		if (error) {
			console.error("fetchCategories error:", error.message);
			return [];
		}

		return (data || []).map((row) => ({
			id: row.id,
			name: row.name || "",
			href: `/products/${row.id}`,
			sold: row.sold,
			image: row.image,
			description: row.description
				? String(row.description)
						.split("\n")
						.map((line) => line.trim())
						.filter(Boolean)
				: [],
		}));
	} catch (err) {
		console.error("fetchCategories exception:", err);
		return [];
	}
};

export const fetchServices = async (): Promise<Service[]> => {
	const supabase = getSupabaseClient();
	if (!supabase) return [];

	try {
		const { data, error } = await supabase
			.from("services")
			.select("id, name, description, status,href, created_at")
			.eq("status", true)
			.order("created_at", { ascending: true });

		if (error) {
			console.error("fetchServices error:", error.message);
			return [];
		}

		return (data || []).map((row) => ({
			id: row.id,
			title: row.name,
			description: row.description || "",
            href: row.href || "",
			status: toBooleanStatus(row.status),
		}));
	} catch (err) {
		console.error("fetchServices exception:", err);
		return [];
	}
};

export const fetchServiceBySlug = async (
	slug: string,
): Promise<Service | null> => {
	const supabase = getSupabaseClient();
	if (!supabase) return null;

	try {
		const { data, error } = await supabase
			.from("services")
			.select("id, name, description, status, image")
			.eq("id", slug)
			.eq("status", true)
			.single();

		if (error || !data) {
			console.error(
				`fetchServiceBySlug for slug "${slug}" error:`,
				error?.message,
			);
			return null;
		}

		return {
			id: data.id,
			title: data.name,
			description: data.description || "",
			status: toBooleanStatus(data.status),
		};
	} catch (err) {
		console.error(`fetchServiceBySlug for slug "${slug}" exception:`, err);
		return null;
	}
};

export const fetchPosts = async (): Promise<Post[]> => {
	try {
		const supabase = getSupabaseClient();
		if (!supabase) throw new Error("Supabase client missing");

		const { data, error } = await supabase
			.from("posts")
			.select("id,title,content,date")
			.order("date", { ascending: false })
			.limit(9);

		if (error) throw error;

		return (data || []).map((row) => ({
			id: row.id,
			title: row.title || "",
			content: row.content || "",
			excerpt: row.content ? row.content.substring(0, 100) + "..." : "",
			date: row.date,
		}));
	} catch (err) {
		console.error("fetchPosts failed", err);
		return [];
	}
};

export const fetchAllProducts = async (): Promise<ProductListItem[]> => {
	const supabase = getSupabaseClient();
	if (!supabase) return [];

	try {
		const { data, error } = await supabase
			.from("products")
			.select("id,category_id,name,price,sold,sale,status,image");

		if (error) {
			console.error("fetchAllProducts error:", error.message);
			return [];
		}

		return (data || []).map((row) => ({
			id: `${row.category_id}-${row.id}`,
			categoryId: row.category_id,
			title: row.name || "",
			price: row.price,
			sold: Number(row.sold ?? 0),
			save: row.sale ? `${row.sale}%` : undefined,
			status: toBooleanStatus(row.status),
			image: row.image,
		}));
	} catch (err) {
		console.error("fetchAllProducts exception:", err);
		return [];
	}
};

export const fetchPopularProducts = async () => {
	const products = await fetchAllProducts();
	return products.sort((a, b) => (b.sold || 0) - (a.sold || 0)).slice(0, 6);
};

export const fetchDeals = async () => {
	const products = await fetchAllProducts();
	const withSale = products.filter((p) => p.save);

	const source = withSale.length
		? withSale
		: products.sort((a, b) => (b.sold || 0) - (a.sold || 0));

	const sorted = source.sort((a, b) => {
		const sa = parseFloat(a.save?.replace("%", "") || "0");
		const sb = parseFloat(b.save?.replace("%", "") || "0");
		return sb - sa;
	});

	const top = sorted.slice(0, 6);
	return top.map((p) => ({
		id: p.id,
		title: p.title,
		rate: p.save || "0%",
		tag: "Ưu đãi nhiều nhất",
		href: `/products/${p.categoryId}`,
	}));
};

export const fetchProductDetail = async (
	categoryId: string,
): Promise<ProductSource | null> => {
	const supabase = getSupabaseClient();
	if (!supabase) return null;

	try {
		// Fetch Category Info
		const { data: catData, error: catErr } = await supabase
			.from("categories")
			.select("id,name,sold,image,description")
			.eq("id", categoryId)
			.single();

		if (catErr || !catData) {
			// console.warn("fetchProductDetail (cat) error:", catErr); // Optional log
			return null;
		}

		// Fetch Variants (Products in category)
		const { data: prodData, error: prodErr } = await supabase
			.from("products")
			.select("id,category_id,name,price,sold,sale,status,image")
			.eq("category_id", categoryId);

		if (prodErr) console.error("fetchProductDetail (prod) error:", prodErr);

		const variants: ProductVariant[] = (prodData || []).map((v) => ({
			id: v.id,
			label: v.name || "",
			price: v.price,
			sold: v.sold,
			save: v.sale ? `${v.sale}%` : undefined,
			status: toBooleanStatus(v.status),
		}));

		return {
			title: catData.name || "",
			image: catData.image,
			guarantee: "",
			notes: [],
			variants,
			description: catData.description || "",
			related: [],
		};
	} catch (err) {
		console.error("fetchProductDetail exception:", err);
		return null;
	}
};

export const fetchNavigation = async () => {
	const categories = await fetchCategories();

	const productLinks = categories.map((cat) => ({
		label: cat.name,
		href: cat.href ?? `/products/${cat.id}`,
	}));

	return [...productLinks, { label: "Dịch vụ", href: "/services" }];
};
