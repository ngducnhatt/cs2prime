"use client";

import { useEffect, useMemo, useState } from "react";

import ProductDescription from "@/app/components/products/ProductDescription";
import ProductImage from "@/app/components/products/ProductImage";
import OrderForm from "@/app/components/products/OrderForm";
import ProductVariants from "@/app/components/products/ProductList";
import { fetchBanks, fetchProductDetail } from "@/lib/data";
import type { Bank, ProductSource, ProductVariant } from "@/lib/types";

const CACHE_TTL = 60_000;
const placeholderImg = "/assets/placeholder-card.svg";
const categoryId = "duel";

type Detail = {
	hero: {
		title: string;
		region?: string;
		guarantee?: string;
		image?: string;
		notes?: string[];
	};
	variants: (ProductVariant & { status?: boolean })[];
	description: string;
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
		description: data.description || "",
	};
};

const readCacheDetail = (): Detail | null => {
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

const writeCacheDetail = (value: Detail) => {
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

const DuelPage = () => {
	const [detail, setDetail] = useState<Detail | null>(null);
	const [selected, setSelected] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [banks, setBanks] = useState<Bank[]>([]);

	useEffect(() => {
		let mounted = true;

		// Try loading from cache first
		const cachedDetail = readCacheDetail();
		if (cachedDetail) {
			setDetail(cachedDetail);
			setSelected(cachedDetail.variants[0]?.id ?? "");
		}

		fetchProductDetail(categoryId)
			.then((data) => {
				if (!mounted) return;
				const normalized = normalizeDetail(data);
				if (!normalized) {
					setError("Không tìm thấy sản phẩm");
					return;
				}
				setDetail(normalized);
				if (
					!selected ||
					!normalized.variants.some((v) => v.id === selected)
				) {
					setSelected(normalized.variants[0]?.id ?? "");
				}
				writeCacheDetail(normalized);
			})
			.catch((err) => {
				if (!mounted) return;
				setError(err?.message || "Không tải được dữ liệu sản phẩm");
			});

		return () => {
			mounted = false;
		};
	}, []);

	useEffect(() => {
		let mounted = true;
		fetchBanks().then((fetchedBanks) => {
			if (mounted) {
				setBanks(fetchedBanks);
			}
		});
		return () => {
			mounted = false;
		};
	}, []);

	const selectedItem = useMemo(() => {
		if (!detail) return undefined;
		return (
			detail.variants.find((v) => v.id === selected) || detail.variants[0]
		);
	}, [detail, selected]);

	if (error) {
		return (
			<div className="rounded-2xl border border-surface-600 bg-surface-700 p-6 text-ink-50">
				<p>{error}</p>
			</div>
		);
	}

	if (!detail || !selectedItem) {
		return (
			<div className="rounded-2xl border border-surface-600 bg-surface-700 p-6 text-ink-50">
				Đang tải dữ liệu sản phẩm...
			</div>
		);
	}

	return (
		<div className="px-4 space-y-6">
			<ProductImage hero={detail.hero} placeholderImg={placeholderImg} />
			<div className="grid gap-5 lg:grid-cols-3">
				<div className="space-y-6 lg:col-span-2">
					<ProductVariants
						variants={detail.variants}
						selectedId={selectedItem?.id}
						onSelect={setSelected}
						formatPrice={formatPrice}
					/>
					<ProductDescription description={detail.description} />
				</div>
				<div className="space-y-6">
					<OrderForm selectedItem={selectedItem} banks={banks} />
				</div>
			</div>
		</div>
	);
};

export default DuelPage;
