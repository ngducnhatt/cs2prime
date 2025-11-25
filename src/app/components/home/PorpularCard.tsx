"use client";

import Image from "next/image";
import Link from "next/link";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";

import duelData from "@/data/products/duel.json";
import empireData from "@/data/products/empire.json";
import faceitData from "@/data/products/faceit.json";
import mobilecardsData from "@/data/products/mobilecards.json";
import steamData from "@/data/products/steam.json";

type CardItem = {
	id: string;
	title: string;
	tag?: string;
	color?: string;
	href: string;
	image?: string;
	priceRange?: string;
	rating?: number;
	sold?: number;
};

type VariantWithMeta = {
	id: string;
	label: string;
	tag?: string;
	sold?: number;
	price?: number;
};

type SourceWithMeta = {
	title: string;
	variants: VariantWithMeta[];
	image?: string;
};

const formatPrice = (price?: number) => {
	if (!price) return null;
	try {
		return new Intl.NumberFormat("vi-VN").format(price) + " VND";
	} catch {
		return `${price} VND`;
	}
};

const buildPopularItems = () => {
	const sources: { categoryId: string; data: SourceWithMeta }[] = [
		{ categoryId: "duel", data: duelData as SourceWithMeta },
		{ categoryId: "csgoempire", data: empireData as SourceWithMeta },
		{ categoryId: "faceit", data: faceitData as SourceWithMeta },
		{ categoryId: "mobilecards", data: mobilecardsData as SourceWithMeta },
		{ categoryId: "steam", data: steamData as SourceWithMeta },
	];

	const items = sources.flatMap(({ categoryId, data }) =>
		(data.variants || []).map((variant) => ({
			id: `${categoryId}-${variant.id}`,
			title: `${variant.label}`,
			tag: variant.tag || "Hot",
			sold: variant.sold ?? 0,
			priceRange: formatPrice(variant.price) ?? "Lien he",
			image: data.image,
			href: `/products/${categoryId}`,
		})),
	);

	return items.sort((a, b) => (b.sold || 0) - (a.sold || 0)).slice(0, 6);
};

const PorpularCard = ({ hrefLabel }: { hrefLabel?: string }) => {
	const placeholderImg = "/assets/placeholder-card.svg";
	const items: CardItem[] = buildPopularItems();

	return (
		<section className="space-y-2">
			<div className="flex items-center justify-between">
				<h2 className="text-lg font-semibold text-ink-50">
					Sản phẩm phổ biến
				</h2>
				<Link
					href="/products"
					className="text-sm font-semibold hover:text-primary-400">
					{hrefLabel || "Xem thêm"}
				</Link>
			</div>
			<div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
				{items.map((card) => {
					const displayPrice = card.priceRange || "Lien he";
					const displayRating = card.rating ?? 4.5;
					const fullStars = Math.floor(displayRating);
					const showHalf = displayRating % 1 >= 0.5;
					const soldCount = card.sold !== undefined ? card.sold : 0;

					return (
						<Link
							key={card.id}
							href={card.href}
							className="group flex gap-3 rounded-2xl border border-surface-600 bg-surface-700 p-3 shadow-soft transition hover:border-primary-900/70">
							<div className="relative w-24 aspect-[522/653] flex-shrink-0 overflow-hidden rounded-2xl">
								<Image
									src={card.image || placeholderImg}
									alt={card.title}
									fill
									sizes="96px"
									className="object-cover transition-transform duration-300 ease-out group-hover:scale-110"
								/>
							</div>

							<div className="flex flex-1 flex-col justify-between gap-2">
								<div className="space-y-1">
									<p className="text-sm font-normal leading-snug text-ink-50 line-clamp-2">
										{card.title}
									</p>
									<p className="text-xs font-thin text-ink-200 line-clamp-1">
										{card.tag || "Order ngay"}
									</p>
								</div>
								<div className="space-y-1">
									<p className="text-base font-normal text-ink-400">
										{displayPrice}
									</p>
									<div className="flex items-center gap-2 text-xs text-ink-200">
										<div className="flex items-center gap-1 text-warning-300">
											{Array.from(
												{ length: fullStars },
												(_, idx) => (
													<FaStar
														key={idx}
														className="h-4 w-4"
													/>
												),
											)}
											{showHalf && (
												<FaStarHalfAlt className="h-4 w-4" />
											)}
										</div>
										<span className="ml-auto text-ink-300">
											Đã bán {soldCount}
										</span>
									</div>
								</div>
							</div>
						</Link>
					);
				})}
			</div>
		</section>
	);
};

export default PorpularCard;
