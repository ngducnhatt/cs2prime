type Deal = {
	id: string;
	title: string;
	rate: string;
	href: string;
};

type Props = {
	deals?: Deal[];
};

const HomeSale = ({ deals = [] }: Props) => {
	return (
		<section className="space-y-2">
			<div className="flex items-center justify-between">
				<h2 className="text-lg font-semibold text-ink-50">
					Ưu đãi đặc quyền
				</h2>
			</div>
			<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
				{deals.map((deal) => (
					<a
						key={deal.id}
						href={deal.href}
						className={`rounded-3xl bg-linear-to-r border border-primary-800 hover:border-primary-900 from-primary-800 via-primary-800 to-primary-700 p-3 shadow-soft`}>
						<div className="rounded-lg px-2 py-2 text-ink-50">
							<p className="mt-1 text-sm font-bold">
								{deal.title}
							</p>
							<p className="text-sm font-thin">-{deal.rate}</p>
						</div>
					</a>
				))}
				{!deals.length && (
					<p className="text-sm text-ink-200">Chưa có ưu đãi.</p>
				)}
			</div>
		</section>
	);
};

export default HomeSale;
