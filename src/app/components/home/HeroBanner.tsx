"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Slide = {
	title: string;
	subtitle?: string;
	description?: string;
	image: string;
	href: string;
};

const AUTOPLAY_DELAY = 10000;

const HeroBanner = () => {
	const slides = useMemo<Slide[]>(
		() => [
			{
				title: "CS2 Prime",
				subtitle: "Chi tu 430K",
				description: "Giao nhanh, an toan, ho tro 24/7.",
				image: "https://pub-f0a6dec73e084e83be3f5ea518ee5da7.r2.dev/cs2prime.jpg",
				href: "/products/steam",
			},
			{
				title: "Steam Wallet",
				subtitle: "Giam den 2%",
				description: "Nap vao Steam nhanh chong, an toan.",
				image: "https://pub-f0a6dec73e084e83be3f5ea518ee5da7.r2.dev/cs2prime.jpg",
				href: "/products/steam",
			},
			{
				title: "Vi tra sau",
				subtitle: "Rut ve vi Momo",
				description: "Nhanh gon, chiet khau cao.",
				image: "https://pub-f0a6dec73e084e83be3f5ea518ee5da7.r2.dev/cs2prime.jpg",
				href: "/products/steam",
			},
		],
		[],
	);

	const [active, setActive] = useState(0);

	useEffect(() => {
		if (!slides.length) return;
		const id = setInterval(
			() => setActive((idx) => (idx + 1) % slides.length),
			AUTOPLAY_DELAY,
		);
		return () => clearInterval(id);
	}, [slides.length]);

	if (!slides.length) return null;

	const prevIdx = (active - 1 + slides.length) % slides.length;
	const nextIdx = (active + 1) % slides.length;
	const prevImage = slides[prevIdx]?.image;
	const nextImage = slides[nextIdx]?.image;

	const handlePrev = () =>
		setActive((idx) => (idx - 1 + slides.length) % slides.length);
	const handleNext = () => setActive((idx) => (idx + 1) % slides.length);

	const mainHeights = "h-[200px] sm:h-[260px] md:h-[320px] lg:h-[380px]";

	return (
		<section className="relative isolate overflow-hidden rounded-3xl bg-ink-900 w-full ">
			<div className="flex items-stretch gap-3 lg:gap-4">
				<SidePreview
					image={prevImage}
					direction="left"
					onClick={handlePrev}
					label="Slide truoc"
					heightClass={mainHeights}
				/>

				<div className="relative flex-1 basis-[75%] overflow-hidden rounded-2xl bg-ink-900/60">
					<div
						className="flex transition-transform duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)]"
						style={{
							transform: `translateX(-${active * 100}%)`,
						}}>
						{slides.map((slide, idx) => (
							<div
								key={`${slide.title}-${idx}`}
								className="min-w-full shrink-0 overflow-hidden rounded-2xl">
								<div
									className={`relative w-full overflow-hidden rounded-3xl bg-gradient-to-r from-primary-800 via-primary-600 to-primary-300 p-6 text-ink-50 shadow-soft sm:p-8 ${mainHeights}`}>
									<div className="flex h-full flex-col gap-3 md:flex-row md:items-center md:justify-between">
										<div className="space-y-2 md:max-w-md">
											<p className="text-xs font-thin uppercase tracking-[0.5em]">
												{slide.title}
											</p>
											{slide.subtitle && (
												<h1 className="text-3xl font-bold leading-tight">
													{slide.subtitle}
												</h1>
											)}
											{slide.description && (
												<p className="text-sm font-thin">
													{slide.description}
												</p>
											)}
											<Link
												href={slide.href}
												className="inline-flex w-fit items-center rounded-full bg-surface-700 px-4 py-2 text-sm font-medium text-ink-50 transition hover:-translate-y-0.5 hover:bg-ink-700">
												Mua ngay
											</Link>
										</div>
										<div className="relative h-full w-full overflow-hidden rounded-2xl bg-black/15 md:h-full md:max-w-lg">
											<Image
												src={slide.image}
												alt={slide.title}
												fill
												sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 50vw"
												className="object-cover transition duration-700 hover:scale-105"
												priority={idx === 0}
											/>
											<div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
										</div>
									</div>
								</div>
							</div>
						))}
					</div>

					<div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
						{slides.map((_, idx) => (
							<button
								key={idx}
								type="button"
								onClick={() => setActive(idx)}
								className={`h-2.5 w-2.5 rounded-full transition duration-300 ${
									active === idx
										? "bg-white"
										: "bg-white/40 hover:bg-white/70"
								}`}
								aria-label={`Di toi slide ${idx + 1}`}
								aria-pressed={active === idx}
							/>
						))}
					</div>
				</div>

				<SidePreview
					image={nextImage}
					direction="right"
					onClick={handleNext}
					label="Slide tiep"
					heightClass={mainHeights}
				/>
			</div>
		</section>
	);
};

const SidePreview = ({
	image,
	direction,
	onClick,
	label,
	heightClass,
}: {
	image?: string;
	direction: "left" | "right";
	onClick: () => void;
	label: string;
	heightClass: string;
}) => (
	<button
		type="button"
		onClick={onClick}
		className={`group relative hidden shrink-0 basis-[12.5%] overflow-hidden rounded-2xl border border-white/10 bg-surface-700/70 text-white shadow-soft transition hover:-translate-y-1 hover:border-white/25 hover:shadow-[0_12px_30px_rgba(0,0,0,0.45)] md:block ${heightClass}`}
		aria-label={label}>
		{image ? (
			<Image
				src={image}
				alt={label}
				fill
				sizes="120px"
				className="object-cover brightness-80 grayscale blur-md transition duration-500 group-hover:scale-105 group-hover:grayscale-0 group-hover:blur-sm"
				priority={false}
			/>
		) : (
			<div className="absolute inset-0 bg-surface-700/80" />
		)}
		<div
			className={`absolute inset-0 ${
				direction === "left" ? "bg-gradient-to-r" : "bg-gradient-to-l"
			} from-black/70 via-black/40 to-transparent`}
		/>
		<span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-white/85 drop-shadow-lg transition duration-300 group-hover:scale-110 group-hover:text-white">
			{direction === "left" ? "<" : ">"}
		</span>
	</button>
);

export default HeroBanner;
