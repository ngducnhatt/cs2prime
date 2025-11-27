"use client";

import type { ProductSection } from "@/lib/types";

type ProductDescriptionProps = {
	description: ProductSection[];
};

const ProductDescription = ({ description }: ProductDescriptionProps) => (
	<div className="space-y-3 rounded-2xl border border-surface-600 bg-surface-700 p-5 shadow-soft">
		<h3 className="text-sm font-normal text-ink-50">Mô tả</h3>
		{description.map((section, idx) => (
			<div key={`${section.title}-${idx}`} className="space-y-2">
				<p className="text-base font-semibold text-ink-50">
					{section.title}
				</p>
				<ul className="list-disc space-y-1 pl-5 text-sm text-ink-100/80">
					{section.body.map((line) => (
						<li key={line}>{line}</li>
					))}
				</ul>
			</div>
		))}
	</div>
);

export default ProductDescription;
