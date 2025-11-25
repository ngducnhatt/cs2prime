"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { FaSearch } from "react-icons/fa";

import productsData from "@/data/products.json";
import accountGameData from "@/data/products/accountgame.json";
import duelData from "@/data/products/duel.json";
import empireData from "@/data/products/empire.json";
import faceitData from "@/data/products/faceit.json";
import mobilecardsData from "@/data/products/mobilecards.json";
import steamData from "@/data/products/steam.json";

type Category = {
	id: string;
	label: string;
	href: string;
	count?: number;
	sold?: number;
};

type Variant = {
	id: string;
	label: string;
	price?: number;
	sold?: number;
	tag?: string;
	save?: string;
};

type ProductSource = {
	title: string;
	region?: string;
	image?: string;
	variants?: Variant[];
};

type ProductItem = {
	id: string;
	categoryId: string;
	title: string;
	price?: number;
	sold?: number;
	tag?: boolean;
	image?: string;
	region?: string;
};

const productSources: Record<string, ProductSource> = {
	steam: steamData as ProductSource,
	csgoempire: empireData as ProductSource,
	mobilecards: mobilecardsData as ProductSource,
	faceit: faceitData as ProductSource,
	duel: duelData as ProductSource,
	accountgame: accountGameData as ProductSource,
};

const placeholderImg = "/assets/placeholder-card.svg";

const formatPrice = (price?: number) => {
	if (price === undefined) return "Lien he";
	return `${new Intl.NumberFormat("vi-VN").format(price)} VND`;
};

const buildProducts = () =>
	Object.entries(productSources).flatMap<ProductItem>(
		([categoryId, source]) =>
			(source.variants || []).map((variant) => ({
				id: `${categoryId}-${variant.id}`,
				categoryId,
				title: `${variant.label}`,
				price: variant.price,
				sold: variant.sold,
				image: source.image,
				region: source.region,
			})),
	);

const ProductsPage = () => {
	const categories = (productsData.categories ?? []) as Category[];
	const [activeCategory, setActiveCategory] = useState<string>(
		categories.find((c) => c.id === "all")?.id ||
			categories[0]?.id ||
			"all",
	);
	const [search, setSearch] = useState("");

	const allProducts = useMemo(() => buildProducts(), []);

	const countsByCategory = useMemo(() => {
		const counts: Record<string, number> = { all: allProducts.length };
		allProducts.forEach((p) => {
			counts[p.categoryId] = (counts[p.categoryId] || 0) + 1;
		});
		return counts;
	}, [allProducts]);

	const filteredProducts = useMemo(() => {
		const term = search.trim().toLowerCase();
		return allProducts.filter((product) => {
			const matchCategory =
				activeCategory === "all" ||
				product.categoryId === activeCategory;
			const matchSearch =
				!term || product.title.toLowerCase().includes(term);
			return matchCategory && matchSearch;
		});
	}, [activeCategory, allProducts, search]);

	return (
		<div className="space-y-6">
			<div className="relative w-full max-w-md">
				<input
					type="text"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					placeholder="Tìm kiếm sản phẩm"
					className="w-full rounded-3xl border border-surface-600 bg-surface-700 px-4 py-2 pl-10 text-sm text-ink-50 placeholder:text-ink-100/60 focus:border-surface-500 focus:outline-none"
				/>
				<span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-100/70">
					<FaSearch />
				</span>
			</div>

			<div className="grid gap-4 lg:grid-cols-[260px,1fr]">
				<aside className="rounded-2xl border border-surface-600 bg-surface-700 p-4 shadow-soft">
					<p className="text-lg font-normal text-ink-50">Danh mục</p>
					<div className="mt-3 space-y-2">
						{categories.map((cat) => {
							const active = activeCategory === cat.id;
							const countLabel =
								countsByCategory[cat.id] ??
								cat.count ??
								cat.sold ??
								0;
							return (
								<button
									key={cat.id}
									onClick={() => setActiveCategory(cat.id)}
									className={`flex w-full items-center justify-between rounded-3xl px-3 py-2 text-sm font-thin transition ${
										active
											? "bg-ink-800 text-ink-50"
											: "text-ink-100/80 hover:bg-ink-800"
									}`}>
									<span className="line-clamp-1 text-left">
										{cat.label}
									</span>
									<span className="text-xs text-ink-100/70">
										{countLabel}
									</span>
								</button>
							);
						})}
					</div>
				</aside>

				<main className="space-y-4">
					{/* <div className="flex items-center justify-between">
						<p className="text-sm text-ink-200">
							Da loc {filteredProducts.length} /{" "}
							{allProducts.length} san pham
						</p>
						{activeCategory !== "all" && (
							<button
								type="button"
								onClick={() => setActiveCategory("all")}
								className="text-xs font-semibold text-primary-300 hover:text-primary-200">
								Reset ve tat ca
							</button>
						)}
					</div> */}

					<div className="rounded-2xl border border-surface-600 bg-surface-700 p-4 shadow-soft">
						<div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
							{filteredProducts.map((product) => (
								<Link
									key={product.id}
									href={`/products/${product.categoryId}`}
									className="flex flex-col rounded-3xl border border-surface-600 bg-surface-700 p-2 transition hover:border-surface-200/60">
									<div className="relative h-40 w-full overflow-hidden rounded-2xl">
										<Image
											src={
												product.image || placeholderImg
											}
											alt={product.title}
											fill
											sizes="200px"
											className="object-cover"
										/>
									</div>
									<div className="mt-2 space-y-1 px-1">
										<p className="text-sm font-semibold text-ink-50 line-clamp-2">
											{product.title}
										</p>
										<p className="text-xs text-ink-200/70">
											{product.region || "Region: -"}
										</p>
										<p className="text-sm font-normal text-primary-200">
											{formatPrice(product.price)}
										</p>
										<div className="flex items-center gap-2 text-xs text-ink-200/50">
											<span>
												Đã bán {product.sold ?? 0}
											</span>
										</div>
									</div>
								</Link>
							))}
						</div>
						{filteredProducts.length === 0 && (
							<p className="text-sm text-ink-200/70">
								Không tìm thấy sản phẩm phù hợp.
							</p>
						)}
					</div>
				</main>
			</div>
		</div>
	);
};

export default ProductsPage;
