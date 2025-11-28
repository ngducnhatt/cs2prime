import { getSupabaseClient } from "./supabaseClient";
import type {
	Category,
	HeroSlide,
	Post,
	ProductListItem,
	ProductSource,
	ProductVariant,
	ProductSection,
	Service,
	Bank,
} from "./types";

export const fetchBanks = async (): Promise<Bank[]> => {
	try {
		const response = await fetch("https://api.vietqr.io/v2/banks");
		if (!response.ok) {
			throw new Error("Failed to fetch banks");
		}
		const result = await response.json();
		return result.data || [];
	} catch (err) {
		console.error("fetchBanks failed", err);
		return [];
	}
};


const toBooleanStatus = (value: unknown) => {
	if (typeof value === "boolean") return value;
	if (typeof value === "number") return value > 0;
	if (typeof value === "string")
		return value === "1" || value.toLowerCase() === "true";
	return true;
};

const hasMojibake = (text?: string | null) =>
	!!text && (text.includes("�") || /A�|cA3|mA�/.test(text));

// --- Fallback Data ---
// The following objects are used as a temporary workaround for data integrity
// issues in the database, such as mojibake (garbled text). The long-term
// solution is to clean the data at the source.
const categoryNameFallback: Record<string, string> = {
	steam: "Steam Wallet Code",
	csgoempire: "CSGO Empire",
	duel: "Duel.com",
	faceit: "Faceit",
	mobilecards: "Mua/Bán thẻ cào",
	accountgame: "Tài khoản game",
};

const categoryDescFallback: Record<string, string[]> = {
	accountgame: [
		"Tài khoản LOL PBE, Valorant night market, Valorant Lv20.",
		"Tài khoản thử nghiệm tính năng mới trước khi phát hành chính thức.",
	],
	csgoempire: [
		"Coins dùng để cược, mở case và tham gia event trên CSGOEmpire.",
		"Hỗ trợ nạp nhanh, cộng coins ngay lập tức.",
	],
	duel: [
		"Duel Value dùng để tham gia cược và mini game trên Duel.com.",
		"Nạp nhanh, sử dụng tức thì sau thanh toán.",
	],
	faceit: [
		"Gói Faceit Plus/Premium, đổi tên hiển thị.",
		"Áp dụng toàn cầu, kích hoạt nhanh.",
	],
	mobilecards: [
		"Thẻ điện thoại Viettel, MobiFone, VinaPhone.",
		"Dùng nạp tiền thoại, data hoặc thanh toán dịch vụ liên kết.",
	],
	steam: [
		"Steam Wallet Code (VND) nạp ví Steam cho PC.",
		"Mã áp dụng theo khu vực/tiền tệ của tài khoản Steam.",
	],
};

const serviceNameFallback: Record<string, string> = {
	visa: "Visa/Mastercard",
	crypto: "Crypto",
};

const serviceDescFallback: Record<string, string> = {
	visa: "Hỗ trợ thanh toán quốc tế qua Visa/Mastercard với tỉ giá tốt.",
	crypto: "Mua bán, hỗ trợ nhận/gửi tiền điện tử nhanh chóng.",
};

const productNameFallback: Record<string, string> = {
	cs2prime: "CS2 Prime",
	duelbuy: "Mua Duel Value",
	duelsell: "Bán Duel Value",
	empirebuy: "Mua Empire coin",
	empiresell: "Bán Empire coin",
	"faceit-change-name": "Đổi tên Faceit",
	"faceit-plus-1": "Faceit Plus 1 tháng",
	"faceit-plus-12": "Faceit Plus 12 tháng",
	"faceit-premium-1": "Faceit Premium 1 tháng",
	"faceit-premium-12": "Faceit Premium 12 tháng",
	lolpbe: "Account LOL PBE",
	"mobifone-100": "Mobifone 100k",
	steam10: "Steam Wallet Code 10$",
	steam5: "Steam Wallet Code 5$",
	valorant9market: "Account Valorant night market",
	valorantlv20: "Account Valorant Lv20",
	"viettel-100": "Viettel 100k",
	"viettel-200": "Viettel 200k",
	"vinaphone-100": "Vinaphone 100k",
};

const postTitleFallback: Record<string, string> = {
	"giftcard-tips": "Lưu ý khi mua giftcard Steam",
	"guide-buy-key": "Hướng dẫn mua key và nạp ví an toàn",
	security: "Bảo vệ tài khoản game khi mua dịch vụ",
};

const postContentFallback: Record<string, string> = {
	"giftcard-tips":
		"Chọn mệnh giá, kiểm tra region và cách redeem nhanh nhất.",
	"guide-buy-key":
		"Các bước xác thực, thanh toán và kiểm tra email để nhận key ngay.",
	security: "Đặt 2FA, giới hạn đăng nhập và lưu ý khi chia sẻ thông tin.",
};

const normalizeVariant = (variant: any): ProductVariant => ({
	id: variant.id,
	label:
		hasMojibake(variant.name) && productNameFallback[variant.id]
			? productNameFallback[variant.id]
			: variant.name ||
			  productNameFallback[variant.id] ||
			  variant.label ||
			  variant.id,
	price: variant.price,
	sold: variant.sold,
	tag: variant.tag,
	save:
		variant.save ??
		(variant.sale !== null && variant.sale !== undefined
			? `${variant.sale}%`
			: undefined),
	bonus: variant.bonus,
	status: toBooleanStatus(variant.status ?? true),
});
export const fetchHeroSections = async (): Promise<HeroSlide[]> => {
	try {
		const supabase = getSupabaseClient();
		if (!supabase) {
			throw new Error("Supabase client not initialized (missing env).");
		}
		const { data, error } = await supabase
			.from("hero_sections")
			.select(
				"title,subtitle,description,image,href,ctalabel,status,priority,created_at",
			)
			.eq("status", true)
			.order("priority", { ascending: true })
			.order("created_at", { ascending: true });

		if (error) throw error;

		return (data || [])
			.map((row) => ({
				title: row.title?.trim() || "",
				subtitle: row.subtitle || undefined,
				description: row.description || undefined,
				image: row.image?.trim() || "",
				href: row.href?.trim() || "/",
				ctalabel: row.ctalabel?.trim() || "mua ngay",
			}))
			.filter((row) => row.title && row.image);
	} catch (err) {
		console.error("fetchHeroSections failed", err);
		return [];
	}
};

export const fetchCategories = async (): Promise<Category[]> => {
	try {
		const supabase = getSupabaseClient();
		if (!supabase) {
			throw new Error("Supabase client not initialized (missing env).");
		}
		const { data, error } = await supabase
			.from("categories")
			.select("id,name,sold,image,description")
			.order("created_at");

		if (error) throw error;

		return (data || []).map((row) => ({
			id: row.id,
			name:
				hasMojibake(row.name) && categoryNameFallback[row.id]
					? categoryNameFallback[row.id]
					: row.name || categoryNameFallback[row.id] || row.id,
			href: `/products/${row.id}`,
			sold: row.sold,
			count: undefined,
			image: row.image,
			description:
				hasMojibake(row.description) || !row.description
					? categoryDescFallback[row.id]
					: String(row.description)
							.split("\n")
							.map((line) => line.trim())
							.filter(Boolean),
		}));
	} catch (err) {
		console.error("fetchCategories failed", err);
		return [];
	}
};

export const fetchServices = async (): Promise<Service[]> => {
	try {
		const supabase = getSupabaseClient();
		if (!supabase) {
			throw new Error("Supabase client not initialized (missing env).");
		}
		const { data, error } = await supabase
			.from("services")
			.select("id,name,description,status,image")
			.order("name");

		if (error) throw error;

		return (data || []).map((row) => ({
			id: row.id,
			title:
				hasMojibake(row.name) && serviceNameFallback[row.id]
					? serviceNameFallback[row.id]
					: row.name || serviceNameFallback[row.id] || row.id,
			description:
				hasMojibake(row.description) && serviceDescFallback[row.id]
					? serviceDescFallback[row.id]
					: row.description || serviceDescFallback[row.id] || "",
			status: toBooleanStatus(row.status ?? true),
		}));
	} catch (err) {
		console.error("fetchServices failed", err);
		return [];
	}
};

export const fetchPosts = async (): Promise<Post[]> => {
	try {
		const supabase = getSupabaseClient();
		if (!supabase) {
			throw new Error("Supabase client not initialized (missing env).");
		}
		const { data, error } = await supabase
			.from("posts")
			.select("id,title,content,date")
			.order("date", { ascending: false })
			.limit(9);

		if (error) throw error;

		return (data || []).map((row) => {
			const title =
				hasMojibake(row.title) && postTitleFallback[row.id]
					? postTitleFallback[row.id]
					: row.title || postTitleFallback[row.id] || row.id;
			const content =
				hasMojibake(row.content) && postContentFallback[row.id]
					? postContentFallback[row.id]
					: row.content || postContentFallback[row.id] || "";
			return {
				id: row.id,
				title,
				content,
				excerpt: content,
				date: row.date,
			};
		});
	} catch (err) {
		console.error("fetchPosts failed", err);
		return [];
	}
};

export const fetchAllProducts = async (): Promise<ProductListItem[]> => {
	try {
		const supabase = getSupabaseClient();
		if (!supabase) {
			throw new Error("Supabase client not initialized (missing env).");
		}
		const { data, error } = await supabase
			.from("products")
			.select("id,category_id,name,price,sold,sale,status,image");

		if (error) throw error;

		return (data || []).map((row) => ({
			id: `${row.category_id}-${row.id}`,
			categoryId: row.category_id,
			title:
				hasMojibake(row.name) && productNameFallback[row.id]
					? productNameFallback[row.id]
					: row.name || productNameFallback[row.id] || row.id,
			price: row.price,
			sold: Number(row.sold ?? 0),
			tag: undefined,
			save:
				row.sale !== null && row.sale !== undefined
					? `${row.sale}%`
					: undefined,
			status: toBooleanStatus(row.status ?? true),
			image: row.image,
		}));
	} catch (err) {
		console.error("fetchAllProducts failed", err);
		return [];
	}
};

export const fetchPopularProducts = async () => {
	const products = await fetchAllProducts();
	const sorted = products
		.map((p) => ({ ...p, sold: Number(p.sold ?? 0) }))
		.sort((a, b) => (b.sold || 0) - (a.sold || 0));
	return sorted.slice(0, 6);
};

export const fetchDeals = async () => {
	const products = await fetchAllProducts();
	const withSale = products.filter((p) => p.save);
	const source = withSale.length
		? withSale
		: products.sort((a, b) => (b.sold || 0) - (a.sold || 0));

	const sorted = source.sort((a, b) => {
		const sa = parseFloat(String(a.save || "0"));
		const sb = parseFloat(String(b.save || "0"));
		return sb - sa;
	});
	const top = sorted.slice(0, 6);
	return top.map((p, idx) => ({
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
	try {
		const supabase = getSupabaseClient();
		if (!supabase) {
			throw new Error("Supabase client not initialized (missing env).");
		}
		const { data: catData, error: catErr } = await supabase
			.from("categories")
			.select("id,name,sold,image,description")
			.eq("id", categoryId)
			.single();
		if (catErr) throw catErr;
		if (!catData) return null;

		const { data: prodData, error: prodErr } = await supabase
			.from("products")
			.select("id,category_id,name,price,sold,sale,status,image")
			.eq("category_id", categoryId);
		if (prodErr) throw prodErr;

		const variants = (prodData || []).map(normalizeVariant);
		const title =
			hasMojibake(catData.name) && categoryNameFallback[categoryId]
				? categoryNameFallback[categoryId]
				: catData.name ||
				  categoryNameFallback[categoryId] ||
				  categoryId;
		const description =
			hasMojibake(catData.description) || !catData.description
				? categoryDescFallback[categoryId]?.join("\n") || ""
				: String(catData.description);

		return {
			title,
			image: catData.image,
			guarantee: "",
			notes: [],
			variants,
			description,
			related: [],
		};
	} catch (err) {
		console.error("fetchProductDetail failed", err);
		return null;
	}
};

export const fetchNavigation = async () => {
	const categories = await fetchCategories();

	const productLinks =
		categories.map((cat) => ({
			label: cat.name,
			href: cat.href ?? `/products/${cat.id}`,
		})) || [];

	// Chỉ thêm một nút Dịch vụ dẫn đến /services
	return [...productLinks, { label: "Dịch vụ", href: "/services" }];
};
