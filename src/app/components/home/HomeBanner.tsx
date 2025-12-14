"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { HeroSlide } from "@/lib/types";

const AUTOPLAY_DELAY = 10000;

type HomeBannerProps = {
	slides: HeroSlide[];
};

const HomeBanner = ({ slides }: HomeBannerProps) => {
	const [active, setActive] = useState(0);
	const autoplayRef = useRef<NodeJS.Timeout | null>(null);

	const startAutoplay = useCallback(() => {
		if (!slides.length) return;
		if (autoplayRef.current) clearInterval(autoplayRef.current);
		autoplayRef.current = setInterval(
			() => setActive((idx) => (idx + 1) % slides.length),
			AUTOPLAY_DELAY,
		);
	}, [slides.length]);

	useEffect(() => {
		startAutoplay();
		return () => {
			if (autoplayRef.current) clearInterval(autoplayRef.current);
		};
	}, [startAutoplay]);

	const goTo = useCallback(
		(updater: (idx: number) => number) => {
			if (!slides.length) return;
			setActive((idx) => updater(idx));
			startAutoplay();
		},
		[startAutoplay, slides.length],
	);

	const handlePrev = () =>
		goTo((idx) => (idx - 1 + slides.length) % slides.length);
	const handleNext = () => goTo((idx) => (idx + 1) % slides.length);

	if (!slides.length) return null;

	const mainHeights = "h-50";

	return (
		<section className="relative isolate overflow-hidden rounded-3xl ">
			<div className="group relative overflow-hidden rounded-3xl bg-ink-900/60">
				<div
					className="flex transition-transform duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)]"
					style={{
						transform: `translateX(-${active * 100}%)`,
					}}>
					{slides.map((slide, idx) => (
						<div
							key={`${slide.title}-${idx}`}
							className="min-w-full shrink-0 overflow-hidden rounded-3xl">
							<div
								className={`relative w-full overflow-hidden rounded-3xl bg-linear-to-r from-primary-800 via-primary-600 to-primary-300 p-6 text-ink-50 shadow-soft sm:p-8 ${mainHeights}`}>
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
											{slide.ctalabel || ""}
										</Link>
									</div>
									<div className="relative hidden h-full w-full overflow-hidden rounded-3xl bg-black/15 md:block md:h-full md:max-w-lg">
										<Image
											src={slide.image}
											alt={slide.title}
											fill
											sizes="(max-width: 1200px) 60vw, 50vw"
											className="object-cover transition duration-700 hover:scale-105"
											priority={idx === 0}
										/>
										<div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-transparent" />
									</div>
								</div>
							</div>
						</div>
					))}
				</div>

				<button
					type="button"
					onClick={handlePrev}
					className="absolute left-0 top-0 z-10 hidden h-full w-14 items-center justify-center bg-linear-to-r from-black/35 via-black/20 to-transparent text-white transition md:flex md:pointer-events-none md:opacity-0 md:group-hover:pointer-events-auto md:group-hover:opacity-100"
					aria-label="Slide truoc"></button>
				<button
					type="button"
					onClick={handleNext}
					className="absolute right-0 top-0 z-10 hidden h-full w-14 items-center justify-center bg-linear-to-l from-black/35 via-black/20 to-transparent text-white transition md:flex md:pointer-events-none md:opacity-0 md:group-hover:pointer-events-auto md:group-hover:opacity-100"
					aria-label="Slide tiep"></button>

				<div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3">
					{slides.map((_, idx) => (
						<button
							key={idx}
							type="button"
							onClick={() => goTo(() => idx)}
							className={`h-2.5 w-6 rounded-full transition duration-300 ${
								active === idx
									? "bg-white"
									: "bg-white/50 hover:bg-white/80"
							}`}
							aria-label={`Di toi slide ${idx + 1}`}
							aria-pressed={active === idx}
						/>
					))}
				</div>
			</div>
		</section>
	);
};

export default HomeBanner;
