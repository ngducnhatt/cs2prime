// import Image from "next/image";

// // import homeData from "@/data/home.json";

// type NewsItem = { title: string; tag: string };

// type NewsCardProps = {
// 	news?: NewsItem[];
// 	placeholder?: string;
// };

// // const NewsCard = ({
// // 	// news = homeData.news as NewsItem[],
// // 	placeholder = "/assets/placeholder-card.svg",
// }: NewsCardProps) => {
// 	return (
// 		<section className="space-y-2">
// 			<h2 className="text-lg font-semibold text-ink-50">Tin tức</h2>
// 			<div className="grid gap-3 md:grid-cols-3">
// 				{news.map((n, idx) => (
// 					<div
// 						key={n.title + idx}
// 						className="rounded-2xl border border-surface-700 bg-surface-700 p-3 shadow-soft">
// 						<div className="relative h-32 w-full overflow-hidden rounded-lg">
// 							<Image
// 								src={placeholder}
// 								alt={n.title}
// 								fill
// 								className="object-cover"
// 							/>
// 						</div>
// 						<p className="mt-2 text-xs uppercase text-ink-200/70">
// 							{n.tag}
// 						</p>
// 						<h3 className="text-sm font-semibold text-ink-50">
// 							{n.title}
// 						</h3>
// 					</div>
// 				))}
// 			</div>
// 		</section>
// 	);
// };

// export default NewsCard;
