"use client";

import { useEffect, useMemo, useState } from "react";

import ProductDescription from "@/app/components/products/ProductDescription";
import ProductHero from "@/app/components/products/productImage";
import ProductSummary from "@/app/components/products/productOrrder";
import ProductVariants from "@/app/components/products/productList";
import { useCart } from "@/app/context/CartContext";
import { fetchProductDetail } from "@/lib/data";
import type {
	ProductSection,
	ProductSource,
	ProductVariant,
} from "@/lib/types";

const CACHE_TTL = 60_000;
const placeholderImg = "/assets/placeholder-card.svg";

type Detail = {
	hero: {
		title: string;
		region?: string;
		guarantee?: string;
		image?: string;
		notes?: string[];
	};
	variants: (ProductVariant & { status?: boolean })[];
	description: ProductSection[];
};

type ProductPageProps = {
	categoryId: string;
	allowNote?: boolean;
	noteLabel?: string;
	notePlaceholder?: string;
};

const toBooleanStatus = (value: unknown) => {
	if (typeof value === "boolean") return value;
	if (typeof value === "number") return value > 0;
	if (typeof value === "string") return value === "1" || value === "true";
	return true;
};

const normalizeDetail = (data: ProductSource | null): Detail | null => {
	if (!data) return null;
	return {
		hero: {
			title: data.title,
			guarantee: data.guarantee,
			image: data.image,
			notes: data.notes || [],
		},
		variants: (data.variants || []).map((variant) => ({
			...variant,
			status: toBooleanStatus(variant.status ?? true),
		})),
		description: data.description || [],
	};
};

const readCacheDetail = (categoryId: string): Detail | null => {
	if (typeof window === "undefined") return null;
	try {
		const raw = sessionStorage.getItem(`cache_detail_${categoryId}`);
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		if (!parsed?.ts || Date.now() - parsed.ts > CACHE_TTL) return null;
		return parsed.data as Detail;
	} catch {
		return null;
	}
};

const writeCacheDetail = (categoryId: string, value: Detail) => {
	if (typeof window === "undefined") return;
	try {
		sessionStorage.setItem(
			`cache_detail_${categoryId}`,
			JSON.stringify({ ts: Date.now(), data: value }),
		);
	} catch {
		// ignore storage error
	}
};

const formatPrice = (value: number) =>
	value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const ProductPage = ({ categoryId, allowNote = false }: ProductPageProps) => {
	const { addToCart } = useCart();
	const [detail, setDetail] = useState<Detail | null>(null);
	const [quantity, setQuantity] = useState(1);
	const [selected, setSelected] = useState("");
	const [note] = useState("");
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let mounted = true;

		const cached = readCacheDetail(categoryId);
		if (cached && mounted) {
			setDetail(cached);
			setSelected(cached.variants[0]?.id ?? "");
		}

		fetchProductDetail(categoryId)
			.then((data) => {
				if (!mounted) return;
				const normalized = normalizeDetail(data);
				if (!normalized) {
					setError("KhA'ng tA�m th���y s���n ph��cm.");
					return;
				}
				setDetail(normalized);
				setSelected(normalized.variants[0]?.id ?? "");
				writeCacheDetail(categoryId, normalized);
			})
			.catch((err) => {
				if (!mounted) return;
				setError(
					err.message ||
						"KhA'ng t���i �`�����c d��_ li���u s���n ph��cm.",
				);
			});

		return () => {
			mounted = false;
		};
	}, [categoryId]);

	const selectedItem = useMemo(() => {
		if (!detail) return undefined;
		return (
			detail.variants.find((v) => v.id === selected) || detail.variants[0]
		);
	}, [detail, selected]);

	const total = (selectedItem?.price || 0) * quantity;
	const available = selectedItem?.status ?? true;

	const handleAddToCart = () => {
		if (selectedItem && available && detail) {
			addToCart(
				{
					id: `${categoryId}-${selectedItem.id}`,
					name: `${detail.hero.title} - ${selectedItem.label}`,
					price: selectedItem.price
						? formatPrice(selectedItem.price)
						: "LiA�n h���",
					image: detail.hero.image,
					categoryId,
					note: allowNote && note ? note : undefined,
				},
				quantity,
			);
		}
	};

	if (error) {
		return (
			<div className="rounded-2xl border border-surface-600 bg-surface-700 p-6 text-ink-50">
				<p>{error}</p>
			</div>
		);
	}

	if (!detail) {
		return (
			<div className="rounded-2xl border border-surface-600 bg-surface-700 p-6 text-ink-50">
				�?ang t���i d��_ li���u s���n ph��cm...
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<ProductHero hero={detail.hero} placeholderImg={placeholderImg} />
			<div className="grid gap-5 lg:grid-cols-[1.7fr,0.9fr]">
				<div className="space-y-4">
					<ProductVariants
						variants={detail.variants}
						selectedId={selectedItem?.id}
						onSelect={setSelected}
						formatPrice={formatPrice}
					/>
					<ProductDescription description={detail.description} />
				</div>
				<ProductSummary
					quantity={quantity}
					total={total}
					available={available}
					onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
					onIncrease={() => setQuantity((q) => q + 1)}
					onAddToCart={handleAddToCart}
					formatPrice={formatPrice}
				/>
			</div>
		</div>
	);
};

export default ProductPage;
