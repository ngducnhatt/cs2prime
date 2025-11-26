import type { Service } from "@/lib/types";

type FeatureCardProps = {
	features: Service[];
};

const FeatureCard = ({ features }: FeatureCardProps) => {
	return (
		<section className="grid gap-4 lg:grid-cols-2">
			{features.map((row, idx) => (
				<div
					key={row.id ?? row.title + idx}
					className="rounded-3xl border border-surface-600 bg-surface-700 p-5 shadow-soft">
					<h3 className="text-base font-semibold text-ink-50">
						{row.title}
					</h3>
					<p className="text-sm text-ink-100/80">{row.description}</p>
					<button className="mt-3 rounded-3xl border border-primary-800 px-3 py-2 text-sm font-normal text-ink-50 hover:border-primary-900">
						Liên hệ
					</button>
				</div>
			))}
		</section>
	);
};

export default FeatureCard;
