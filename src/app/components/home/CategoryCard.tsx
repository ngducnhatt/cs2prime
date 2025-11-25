"use client";
import Link from "next/link";

import productsData from "@/data/products.json";
import servicesData from "@/data/services.json";

type Item = {
	title: string;
	tag: string;
	href?: string;
};

type CategoryCardProps = {
	title: string;
	href?: string;
	items?: Item[];
};

const buildItems = (href: string, fallback?: Item[]) => {
	if (fallback?.length) return fallback;

	if (href === "/services") {
		const services =
			(
				servicesData as {
					services?: { title: string; description?: string }[];
				}
			).services || [];
		return services.map((svc) => ({
			title: svc.title,
			tag: svc.description || "Xem chi tiết",
			href,
		}));
	}

	// Default to products categories (skip "all")
	const categories =
		(
			productsData as {
				categories?: {
					label: string;
					sold?: number;
					href?: string;
					id?: string;
				}[];
			}
		).categories || [];

	return categories
		.filter((cat) => cat.id !== "all")
		.map((cat) => ({
			title: cat.label,
			tag: cat.sold !== undefined ? `Đã bán ${cat.sold}` : "Xem chi tiết",
			href: cat.href || href,
		}));
};

const CategoryCard = ({
	title,
	href = "/products",
	items,
}: CategoryCardProps) => {
	const list = buildItems(href, items);

	return (
		<div className="space-y-2">
			<div className="flex items-center justify-between">
				<h2 className="text-lg font-semibold text-ink-50">{title}</h2>
				<Link
					href={href}
					className="text-sm font-semibold hover:text-primary-400">
					Xem thêm
				</Link>
			</div>
			<div className="grid gap-3 md:grid-cols-3">
				{list.map((item) => (
					<Link
						key={item.title}
						href={item.href || href}
						className="rounded-2xl border border-surface-600 bg-surface-700 p-3 text-ink-50 shadow-soft transition hover:border-primary-900/70">
						<p className="text-sm font-semibold">{item.title}</p>
					</Link>
				))}
			</div>
		</div>
	);
};

export default CategoryCard;
