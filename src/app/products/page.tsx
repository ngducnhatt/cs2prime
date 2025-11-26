"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FaSearch } from "react-icons/fa";

import { fetchAllProducts, fetchCategories } from "@/lib/data";
import type { Category, ProductListItem } from "@/lib/types";

const placeholderImg = "/assets/placeholder-card.svg";
const CACHE_TTL = 60_000; // 60s

const formatPrice = (price?: number) => {
	if (price === undefined) return "Liên hệ";
	return `${new Intl.NumberFormat("vi-VN").format(price)} VND`;
};

const ProductsPage = () => {
	const [categories, setCategories] = useState<Category[]>([]);
	const [products, setProducts] = useState<ProductListItem[]>([]);
	const [activeCategory, setActiveCategory] = useState<string>("all");
	const [search, setSearch] = useState("");
	const [error, setError] = useState<string | null>(null);

	const readCache = <T,>(key: string): T | null => {
		if (typeof window === "undefined") return null;
		try {
			const raw = sessionStorage.getItem(key);
			if (!raw) return null;
			const parsed = JSON.parse(raw);
			if (!parsed?.ts || Date.now() - parsed.ts > CACHE_TTL) return null;
			return parsed.data as T;
		} catch {
			return null;
		}
	};

	const writeCache = (key: string, data: unknown) => {
		if (typeof window === "undefined") return;
		try {
			sessionStorage.setItem(
				key,
				JSON.stringify({ ts: Date.now(), data }),
			);
		} catch {
			// ignore storage errors
		}
	};

	useEffect(() => {
		const load = async () => {
			try {
				const cachedCats = readCache<Category[]>("cache_categories");
				const cachedProducts =
					readCache<ProductListItem[]>("cache_products");

				if (cachedCats?.length) {
					setCategories([
						{ id: "all", name: "Tất cả", href: "/products" },
						...cachedCats,
					]);
					setActiveCategory("all");
				}
				if (cachedProducts?.length) {
					setProducts(cachedProducts);
				}

				const [cats, allProducts] = await Promise.all([
					fetchCategories(),
					fetchAllProducts(),
				]);
				setCategories([
					{ id: "all", name: "Tất cả", href: "/products" },
					...cats,
				]);
				setActiveCategory("all");
				setProducts(allProducts);
				writeCache("cache_categories", cats);
				writeCache("cache_products", allProducts);
			} catch (err: any) {
				setError(err?.message || "Không tải được dữ liệu sản phẩm.");
			}
		};
		load();
	}, []);

	const countsByCategory = useMemo(() => {
		const counts: Record<string, number> = { all: products.length };
		products.forEach((p) => {
			counts[p.categoryId] = (counts[p.categoryId] || 0) + 1;
		});
		return counts;
	}, [products]);

	const filteredProducts = useMemo(() => {
		const term = search.trim().toLowerCase();
		return products.filter((product) => {
			const matchCategory =
				activeCategory === "all" ||
				product.categoryId === activeCategory;
			const matchSearch =
				!term || product.title.toLowerCase().includes(term);
			return matchCategory && matchSearch;
		});
	}, [activeCategory, products, search]);

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
										{cat.name}
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
					<div className="rounded-2xl border border-surface-600 bg-surface-700 p-4 shadow-soft">
						<div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
							{filteredProducts.map((product) => {
								const available = product.status ?? true;
								return (
									<Link
										key={product.id}
										href={`/products/${product.categoryId}`}
										aria-disabled={!available}
										className={`flex flex-col rounded-3xl border border-surface-600 bg-surface-700 p-2 transition hover:border-surface-200/60 ${
											available
												? ""
												: "pointer-events-none opacity-60"
										}`}>
										<div className="relative h-40 w-full overflow-hidden rounded-2xl">
											<Image
												src={
													product.image ||
													placeholderImg
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
											<p className="text-sm font-normal text-primary-200">
												{formatPrice(product.price)}
											</p>
											<div className="flex items-center gap-2 text-xs text-ink-200/50">
												<span>
													Đã bán {product.sold ?? 0}
												</span>
												{!available && (
													<span className="ml-auto rounded-full bg-danger-500/20 px-2 py-0.5 text-[11px] font-semibold text-danger-200">
														Hết hàng
													</span>
												)}
											</div>
										</div>
									</Link>
								);
							})}
						</div>
						{filteredProducts.length === 0 && (
							<p className="text-sm text-ink-200/70">
								Không tìm thấy sản phẩm phù hợp.
							</p>
						)}
						{error && (
							<p className="mt-2 text-sm text-danger-200">
								{error}
							</p>
						)}
					</div>
				</main>
			</div>
		</div>
	);
};

export default ProductsPage;
