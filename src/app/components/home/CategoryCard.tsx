"use client";
import Link from "next/link";

type Item = {
	title: string;
	tag?: string;
	href?: string;
};

type CategoryCardProps = {
	title: string;
	href?: string;
	items?: Item[];
};

const CategoryCard = ({ title, href = "/products", items = [] }: CategoryCardProps) => {
	return (
		<div className="space-y-2">
			<div className="flex items-center justify-between">
				<h2 className="text-lg font-semibold text-ink-50">{title}</h2>
				<Link href={href} className="text-sm font-semibold hover:text-primary-400">
					Xem thêm
				</Link>
			</div>
			<div className="grid gap-3 md:grid-cols-3">
				{items.map((item) => (
					<Link
						key={item.title}
						href={item.href || href}
						className="rounded-2xl border border-surface-600 bg-surface-700 p-3 text-ink-50 shadow-soft transition hover:border-primary-900/70">
						<p className="text-sm font-semibold">{item.title}</p>
						{item.tag && (
							<p className="text-xs text-ink-200/70">{item.tag}</p>
						)}
					</Link>
				))}
			</div>
		</div>
	);
};

export default CategoryCard;
