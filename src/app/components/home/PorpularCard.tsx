"use client";

import Image from "next/image";
import Link from "next/link";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";

type CardItem = {
	id: string;
	title: string;
	tag?: string;
	href: string;
	image?: string;
	priceRange?: string;
	rating?: number;
	sold?: number;
	status?: boolean;
};

const PorpularCard = ({
	items,
	hrefLabel,
}: {
	items: CardItem[];
	hrefLabel?: string;
}) => {
	const placeholderImg = "/assets/placeholder-card.svg";

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
					const displayPrice = card.priceRange || "Liên hệ";
					const displayRating = card.rating ?? 4.5;
					const fullStars = Math.floor(displayRating);
					const showHalf = displayRating % 1 >= 0.5;
					const soldCount = card.sold !== undefined ? card.sold : 0;
					const available = card.status ?? true;

					return (
						<Link
							key={card.id}
							href={card.href}
							aria-disabled={!available}
							className={`group flex gap-3 rounded-2xl border border-surface-600 bg-surface-700 p-3 shadow-soft transition hover:border-primary-900/70 ${
								available ? "" : "pointer-events-none opacity-60"
							}`}>
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
										{available ? card.tag || "Mua ngay" : "Hết hàng"}
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
