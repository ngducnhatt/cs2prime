"use client";

import { useState } from "react";

import ProductDescription from "@/app/components/products/ProductDescription";
import ProductImage from "@/app/components/products/ProductImage";
import ProductSummary from "@/app/components/products/ProductOrder";
import ProductVariants from "@/app/components/products/ProductList";
import { useCart } from "@/app/context/CartContext";
import { useProductDetail } from "@/hooks/useProductDetail";
import ProductSkeleton from "@/app/components/products/ProductSkeleton";

const placeholderImg = "/assets/placeholder-card.svg";
const categoryId = "faceit";

const formatPrice = (value: number) =>
	value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const FaceitClient = () => {
	const { addToCart } = useCart();
	const { detail, selectedItem, setSelected, error } =
		useProductDetail(categoryId);
	const [quantity, setQuantity] = useState(1);

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
						: "Liên hệ",
					image: detail.hero.image,
					categoryId,
				},
				quantity,
			);
		}
	};

	if (error) {
		return (
			<div className="box p-6 text-ink-50">
				<p>{error}</p>
			</div>
		);
	}

	if (!detail) {
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
				<div className="space-y-6 lg:col-span-1">
					<ProductSummary
						quantity={quantity}
						total={total}
						available={available}
						onDecrease={() =>
							setQuantity((q) => Math.max(1, q - 1))
						}
						onIncrease={() => setQuantity((q) => q + 1)}
						onAddToCart={handleAddToCart}
						formatPrice={formatPrice}
					/>
				</div>
			</div>
		</div>
	);
};

export default FaceitClient;
