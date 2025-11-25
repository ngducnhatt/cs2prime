import type { Metadata } from "next";

import CategoryCard from "./components/home/CategoryCard";
import FeatureGrid from "./components/home/FeatureCard";
import HeroBanner from "./components/home/HeroBanner";
// import NewsGrid from "./components/home/NewsCard";
import PorpularCard from "./components/home/PorpularCard";
import SaleCard from "./components/home/SaleCard";

export const metadata: Metadata = {
	title: "Muacode.com",
};

const Home = () => {
	return (
		<div className="space-y-10">
			<HeroBanner />
			<SaleCard />
			<PorpularCard />
			<div className="grid gap-20 lg:grid-cols-2">
				<CategoryCard title="Hệ sinh thái Steam" href="/products" />
				<CategoryCard title="Dịch vụ tiện ích" href="/services" />
			</div>
			{/* <NewsGrid /> */}
			<FeatureGrid />
		</div>
	);
};

export default Home;
