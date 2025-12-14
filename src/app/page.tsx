import type { Metadata } from "next";

import HomeCategory from "@/app/components/home/HomeCategory";
import FeatureGrid from "@/app/components/home/FeatureCard";
import HomeBanner from "@/app/components/home/HomeBanner";
import HomePorpular from "@/app/components/home/HomePorpular";
import HomeSale from "@/app/components/home/HomeSale";
import {
	fetchCategories,
	fetchDeals,
	fetchHeroSections,
	fetchPopularProducts,
	fetchServices,
} from "@/lib/data";

export const metadata: Metadata = {
	title: "CS2Prime.store - Hệ thống dịch vụ CS2 & Dịch vụ Steam",
};

const buildCategoryItems = (
	categories: Awaited<ReturnType<typeof fetchCategories>>,
) =>
	categories
		.filter((cat) => cat.id !== "all")
		.map((cat) => ({
			title: cat.name,
			tag: cat.sold !== undefined ? `Đã bán ${cat.sold}` : "Xem chi tiết",
			href: cat.href ?? `/products/${cat.id}`,
		}));

const buildServiceItems = (
	services: Awaited<ReturnType<typeof fetchServices>>,
) =>
	services.map((svc) => ({
		title: svc.title,
		tag: svc.description,
		href: `/services#${svc.id}`,
	}));

export default async function Home() {
	const [categories, services, popularItems, deals, heroSlides] =
		await Promise.all([
			fetchCategories(),
			fetchServices(),
			fetchPopularProducts(),
			fetchDeals(),
			fetchHeroSections(),
		]);

	return (
		<div className=" px-4 py-10 md:py-12 space-y-10">
			<HomeBanner slides={heroSlides} />
			<HomeSale deals={deals} />
			<HomePorpular
				items={popularItems.map((item) => ({
					...item,
					name: item.title,
					href: `/products/${item.categoryId}`,
					tag: item.save ? `Giảm ${item.save}` : undefined,
					priceRange:
						item.price !== undefined
							? new Intl.NumberFormat("vi-VN").format(
									item.price,
							  ) + " VND"
							: "Liên hệ",
				}))}
			/>
			<div className="grid gap-20 lg:grid-cols-2">
				<HomeCategory
					title="Hệ sinh thái Steam"
					href="/products"
					items={buildCategoryItems(categories)}
				/>
				<HomeCategory
					title="Dịch vụ tiện ích"
					href="/services"
					items={buildServiceItems(services)}
				/>
			</div>
			<FeatureGrid features={services} />
		</div>
	);
}
