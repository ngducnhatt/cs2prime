"use client";

import Image from "next/image";

type ProductHeroProps = {
	hero: {
		title: string;
		region?: string;
		guarantee?: string;
		image?: string;
	};
	placeholderImg: string;
};

const ProductHero = ({ hero, placeholderImg }: ProductHeroProps) => (
	<div className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden rounded-2xl border border-surface-600 bg-surface-700 shadow-soft">
		<div className="relative h-44 w-full md:h-52">
			<Image
				src={hero.image || placeholderImg}
				alt={hero.title}
				fill
				sizes="100vw"
				className="object-cover"
			/>
			<div className="absolute inset-0 bg-gradient-to-t from-surface-700 via-surface-700/80 to-transparent" />
			<div className="absolute inset-x-0 bottom-2 md:bottom-4">
				<div className="mx-auto flex max-w-6xl items-center gap-4">
					<div className="relative w-24 translate-y-1 overflow-hidden rounded-2xl border-white-custom bg-surface-600 shadow-soft aspect-[4/5] md:translate-y-2">
						<Image
							src={hero.image || placeholderImg}
							alt="logo"
							fill
							sizes="96px"
							className="object-contain"
						/>
					</div>
					<h1 className="text-xl font-bold text-ink-50">
						{hero.title}
					</h1>
				</div>
			</div>
		</div>
	</div>
);

export default ProductHero;
