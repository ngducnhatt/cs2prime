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
	return (
		<section className="grid gap-5 lg:grid-cols-[1.5fr,1fr]">
			<div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-800 via-primary-600 to-primary-300 p-6 text-ink-50">
				<div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
					<div className="space-y-2 md:max-w-md">
						<p className="text-xs font-thin uppercase tracking-[0.5em]">
							CS2 Prime
						</p>
						<h1 className="text-3xl font-bold leading-tight">
							Chỉ với 430K
						</h1>
						<p className="text-sm font-thin">Nhanh • An toàn</p>
						<Link
							href="/products/steam"
							className="inline-flex w-fit items-center rounded-full bg-surface-700 hover:bg-ink-700 px-4 py-2 text-sm font-medium text-ink-50 transition ">
							Mua Ngay
						</Link>
					</div>
					<div className="relative h-40 w-full md:h-48 overflow-hidden rounded-3xl">
						<Image
							src={primaryImage}
							alt="Promo"
							fill
							className="object-cover transition-transform duration-300 hover:scale-105"
						/>
					</div>
				</div>
			</div>
			<div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-800 via-primary-600 to-primary-300 p-6 text-ink-50">
				<div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
					<div className="space-y-2 md:max-w-md">
						<p className="text-xs font-thin uppercase tracking-[0.5em]">
							CS2 Prime
						</p>
						<h1 className="text-3xl font-bold leading-tight">
							Chỉ với 430K
						</h1>
						<p className="text-sm font-thin">Nhanh • An toàn</p>
						<Link
							href="/products/steam"
							className="inline-flex w-fit items-center rounded-full bg-surface-700 hover:bg-ink-700 px-4 py-2 text-sm font-medium text-ink-50 transition ">
							Mua Ngay
						</Link>
					</div>
					<div className="relative h-40 w-full md:h-48 overflow-hidden rounded-3xl">
						<Image
							src={primaryImage}
							alt="Promo"
							fill
							className="object-cover transition-transform duration-300 hover:scale-110"
						/>
					</div>
				</div>
			</div>
		</section>
	);
};

export default HeroBanner;
