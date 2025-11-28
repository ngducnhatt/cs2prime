"use client";

import { useEffect, useMemo, useState } from "react";

import ProductDescription from "@/app/components/products/ProductDescription";
import ProductImage from "@/app/components/products/ProductImage";
import OrderForm from "@/app/components/products/OrderForm";
import ProductVariants from "@/app/components/products/ProductList";
import { fetchBanks, fetchProductDetail } from "@/lib/data";
import type { Bank, ProductSource, ProductVariant } from "@/lib/types";

const placeholderImg = "/assets/placeholder-card.svg";
const categoryId = "csgoempire";

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

const CsgoEmpirePage = () => {
	const [detail, setDetail] = useState<Detail | null>(null);
	const [selected, setSelected] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [banks, setBanks] = useState<Bank[]>([]);

	useEffect(() => {
		let mounted = true;

		fetchProductDetail(categoryId)
			.then((data) => {
				if (!mounted) return;
				const normalized = normalizeDetail(data);
				if (!normalized) {
					setError("Không tìm thấy sản phẩm");
					return;
				}
				setDetail(normalized);
				setSelected(normalized.variants[0]?.id ?? "");
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

	const formatPrice = (value: number) =>
		value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

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

export default CsgoEmpirePage;
