"use client";

import Image from "next/image";
import Link from "next/link";

type HeroBannerProps = {
	primaryImage?: string;
	secondaryImage?: string;
};

const HeroBanner = ({
	primaryImage = "https://pub-f0a6dec73e084e83be3f5ea518ee5da7.r2.dev/cs2prime.jpg",
	secondaryImage = "https://pub-f0a6dec73e084e83be3f5ea518ee5da7.r2.dev/cs2prime.jpg",
}: HeroBannerProps) => {
	const blocks = [
		{
			title: "CS2 Prime",
			subtitle: "Chỉ từ 430K",
			description: "Giao nhanh – An toàn",
			image: primaryImage,
			href: "/products/steam",
		},
		{
			title: "Steam Wallet",
			subtitle: "Giảm thêm 2%",
			description: "Nạp ví tức thì",
			image: secondaryImage,
			href: "/products/steam",
		},
	];

	return (
		<section className="grid gap-5 lg:grid-cols-[1.5fr,1fr]">
			{blocks.map((block) => (
				<div
					key={block.title}
					className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-800 via-primary-600 to-primary-300 p-6 text-ink-50">
					<div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
						<div className="space-y-2 md:max-w-md">
							<p className="text-xs font-thin uppercase tracking-[0.5em]">
								{block.title}
							</p>
							<h1 className="text-3xl font-bold leading-tight">
								{block.subtitle}
							</h1>
							<p className="text-sm font-thin">
								{block.description}
							</p>
							<Link
								href={block.href}
								className="inline-flex w-fit items-center rounded-full bg-surface-700 px-4 py-2 text-sm font-medium text-ink-50 transition hover:bg-ink-700">
								Mua ngay
							</Link>
						</div>
					<div className="relative h-40 w-full overflow-hidden rounded-3xl md:h-48">
						<Image
							src={block.image}
							alt={block.title}
							fill
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
							className="object-cover transition-transform duration-300 hover:scale-105"
						/>
					</div>
				</div>
			</div>
			))}
		</section>
	);
};

export default HeroBanner;
