"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";

import { useCart } from "@/app/context/CartContext";
import { fetchProductDetail } from "@/lib/data";
import type {
	ProductSection,
	ProductSource,
	ProductVariant,
} from "@/lib/types";

const CACHE_TTL = 60_000; // 60s cache trên trình duyệt
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

type Props = {
	categoryId: string;
	allowNote?: boolean;
	noteLabel?: string;
	notePlaceholder?: string;
};

const ProductDetailTemplate = ({
	categoryId,
	allowNote = false,
	noteLabel = "Thông tin nhận hàng",
	notePlaceholder = "Ví dụ: tài khoản, server, ghi chú khác...",
}: Props) => {
	const { addToCart } = useCart();
	const cachedDetail =
		typeof window !== "undefined" ? readCacheDetail(categoryId) : null;

	const [detail, setDetail] = useState<Detail | null>(cachedDetail);
	const [quantity, setQuantity] = useState(1);
	const [selected, setSelected] = useState(
		cachedDetail?.variants[0]?.id ?? "",
	);
	const [note, setNote] = useState("");
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let mounted = true;

		fetchProductDetail(categoryId)
			.then((data) => {
				if (!mounted) return;
				const normalized = normalizeDetail(data);
				if (!normalized) {
					setError("Không tìm thấy sản phẩm.");
					return;
				}
				setDetail(normalized);
				setSelected(normalized.variants[0]?.id ?? "");
				writeCacheDetail(categoryId, normalized);
			})
			.catch((err) => {
				if (!mounted) return;
				setError(err.message || "Không tải được dữ liệu sản phẩm.");
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
				Đang tải dữ liệu sản phẩm...
			</div>
		);
	}

	const renderHero = () => (
		<div className="overflow-hidden rounded-2xl border border-surface-600 bg-surface-700 shadow-soft">
			<div className="relative h-44 w-full md:h-52">
				<Image
					src={detail.hero.image || placeholderImg}
					alt={detail.hero.title}
					fill
					sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 600px"
					className="object-cover"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-surface-700 via-surface-700/80 to-transparent" />
				<div className="absolute inset-x-4 bottom-4 flex flex-col gap-2 md:flex-row md:items-center md:gap-6">
					<div className="flex items-center gap-4">
						<div className="relative h-[84px] w-16 overflow-hidden rounded-xl bg-surface-600">
							<Image
								src={detail.hero.image || placeholderImg}
								alt="logo"
								fill
								sizes="64px"
								className="object-cover"
							/>
						</div>
						<div>
							<h1 className="text-xl font-bold text-ink-50">
								{detail.hero.title}
							</h1>
							<div className="mt-1 flex flex-wrap gap-3 text-xs text-ink-100/80">
								{detail.hero.region && (
									<span className="inline-flex items-center gap-1 rounded-full bg-ink-800 px-2 py-1">
										Khu vực {detail.hero.region}
									</span>
								)}
								{detail.hero.guarantee && (
									<span className="inline-flex items-center gap-1 rounded-full bg-ink-800 px-2 py-1">
										{detail.hero.guarantee}
									</span>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);

	const renderVariants = () => (
		<div className="rounded-2xl border border-surface-600 bg-surface-700 p-4 shadow-soft">
			<h3 className="text-sm font-semibold text-ink-50">Chọn sản phẩm</h3>
			<div className="mt-3 grid gap-3 md:grid-cols-2">
				{detail.variants.map((variant) => {
					const active = variant.id === selectedItem?.id;
					const variantAvailable = variant.status ?? true;
					return (
						<button
							key={variant.id}
							onClick={() => setSelected(variant.id)}
							className={`flex flex-col rounded-2xl border px-4 py-3 text-left transition ${
								active
									? "border-surface-700 bg-primary-700/30 text-ink-50"
									: "border-surface-600 bg-surface-700 text-ink-50 hover:border-primary-700"
							}`}>
							<div className="flex items-center justify-between">
								<p className="text-sm font-normal">
									{variant.label}
								</p>
								<div className="flex items-center gap-2">
									{variant.save && (
										<span className="rounded-full bg-success-500/20 px-2 py-0.5 text-xs font-semibold text-success-400">
											{variant.save}
										</span>
									)}
									{variantAvailable === false && (
										<span className="rounded-full bg-danger-500/20 px-2 py-0.5 text-[11px] font-semibold text-danger-200">
											Hết hàng
										</span>
									)}
								</div>
							</div>
							<div className="mt-2 flex items-center justify-between text-xs text-ink-100/80">
								<span>{variant.bonus}</span>
								<span className="text-base font-normal text-ink-100">
									{variant.price
										? formatPrice(variant.price)
										: "Liên hệ"}
								</span>
							</div>
						</button>
					);
				})}
			</div>
		</div>
	);

	const renderNote = () => {
		if (!allowNote) return null;
		return (
			<div className="rounded-2xl border border-surface-600 bg-surface-700 p-4 shadow-soft">
				<h3 className="text-sm font-semibold text-ink-50">
					{noteLabel}
				</h3>
				<p className="mt-1 text-xs text-ink-200/80">
					Nhập tài khoản/email hoặc ghi chú để xử lý đơn nhanh hơn.
				</p>
				<textarea
					value={note}
					onChange={(e) => setNote(e.target.value)}
					placeholder={notePlaceholder}
					className="mt-3 w-full rounded-xl border border-surface-600 bg-ink-900 px-3 py-2 text-sm text-ink-50 placeholder:text-ink-200/50 focus:border-primary-700 focus:outline-none"
					rows={3}
				/>
			</div>
		);
	};

	const renderDescription = () => (
		<div className="space-y-3 rounded-2xl border border-surface-600 bg-surface-700 p-5 shadow-soft">
			<h3 className="text-sm font-normal text-ink-50">Mô tả</h3>
			{detail.description.map((section, idx) => (
				<div key={`${section.title}-${idx}`} className="space-y-2">
					<p className="text-base font-semibold text-ink-50">
						{section.title}
					</p>
					<ul className="list-disc space-y-1 pl-5 text-sm text-ink-100/80">
						{section.body.map((line) => (
							<li key={line}>{line}</li>
						))}
					</ul>
				</div>
			))}
		</div>
	);

	const renderSummary = () => (
		<aside className="space-y-4">
			<div className="rounded-2xl border border-surface-600 bg-surface-700 p-4 shadow-soft">
				<div className="flex items-center justify-between">
					<p className="text-sm font-normal text-ink-50">Số lượng</p>
					<div className="flex items-center gap-2">
						<button
							onClick={() =>
								setQuantity((q) => Math.max(1, q - 1))
							}
							aria-label="Giảm số lượng">
							<CiCircleMinus />
						</button>
						<span className="min-w-[24px] text-center text-sm text-ink-50">
							{quantity}
						</span>
						<button
							onClick={() => setQuantity((q) => q + 1)}
							aria-label="Tăng số lượng">
							<CiCirclePlus />
						</button>
					</div>
				</div>
				<div className="mt-3 rounded-xl border border-surface-600 bg-ink-950 p-3">
					<p className="text-sm font-semibold text-ink-50">
						Tạm tính
					</p>
					<p className="text-2xl font-normal text-ink-50">
						{formatPrice(total)}
					</p>

					<div className="mt-3 flex flex-col gap-2">
						<button
							disabled={!available}
							className="w-full rounded-3xl bg-info-400 px-4 py-2 text-sm font-medium text-ink-50 disabled:cursor-not-allowed disabled:bg-ink-800 disabled:text-ink-200"
							onClick={() => {
								if (selectedItem && available) {
									addToCart(
										{
											id: `${categoryId}-${selectedItem.id}`,
											name: `${detail.hero.title} - ${selectedItem.label}`,
											price: selectedItem.price
												? formatPrice(
														selectedItem.price,
												  )
												: "Liên hệ",
											image: detail.hero.image,
											categoryId,
											note: allowNote
												? note || undefined
												: undefined,
										},
										quantity,
									);
								}
							}}>
							{available ? "Thêm vào giỏ hàng" : "Hết hàng"}
						</button>
						<button
							className="w-full rounded-3xl bg-white px-4 py-2 text-sm font-medium text-black "
							onClick={() => {
								window.location.href = "/checkout";
							}}>
							Xem giỏ hàng
						</button>
					</div>
				</div>
			</div>
		</aside>
	);

	return (
		<div className="space-y-6">
			{renderHero()}
			<div className="grid gap-5 lg:grid-cols-[1.7fr,0.9fr]">
				<div className="space-y-4">
					{renderVariants()}
					{renderNote()}
					{renderDescription()}
				</div>
				{renderSummary()}
			</div>
		</div>
	);
};

export default ProductDetailTemplate;
