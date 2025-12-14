"use client";

import { useEffect, useState } from "react";

import ProductDescription from "@/app/components/products/ProductDescription";
import ProductImage from "@/app/components/products/ProductImage";
import OrderForm from "@/app/components/products/OrderForm";
import ProductVariants from "@/app/components/products/ProductList";
import { fetchBanks } from "@/lib/data";
import type { Bank } from "@/lib/types";
import { useProductDetail } from "@/hooks/useProductDetail";
import ProductSkeleton from "@/app/components/products/ProductSkeleton";

const placeholderImg = "/assets/placeholder-card.svg";
const categoryId = "duel";

const formatPrice = (value: number) =>
	value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const DuelClient = () => {
	const { detail, selectedItem, setSelected, error } =
		useProductDetail(categoryId);
	const [banks, setBanks] = useState<Bank[]>([]);

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

	if (error) {
		return (
			<div className="box p-6 text-ink-50">
				<p>{error}</p>
			</div>
		);
	}

	if (!detail || !selectedItem) {
		return <ProductSkeleton />;
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
					<OrderForm selectedItem={selectedItem} banks={banks} categoryId={categoryId} />
				</div>
			</div>
		</div>
	);
};

export default DuelClient;
