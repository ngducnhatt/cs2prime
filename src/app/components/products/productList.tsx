"use client";

import type { ProductVariant } from "@/lib/types";

type ProductVariantsProps = {
	variants: (ProductVariant & { status?: boolean })[];
	selectedId?: string;
	onSelect: (id: string) => void;
	formatPrice: (value: number) => string;
};

const productList = ({
	variants,
	selectedId,
	onSelect,
	formatPrice,
}: ProductVariantsProps) => (
	<div className="rounded-2xl border border-surface-600 bg-surface-700 p-4 shadow-soft">
		<h3 className="text-sm font-semibold text-ink-50">Chọn sản phẩm</h3>
		<div className="mt-3 grid gap-3 md:grid-cols-2">
			{variants.map((variant) => {
				const active = variant.id === selectedId;
				const variantAvailable = variant.status ?? true;
				return (
					<button
						key={variant.id}
						onClick={() => onSelect(variant.id)}
						className={`flex flex-col rounded-2xl border px-4 py-3 text-left transition ${
							active
								? "border-surface-700 bg-primary-700/30 text-ink-50"
								: "border-surface-600 bg-surface-700 text-ink-50 hover:border-primary-700"
						}`}>
						<div className="flex items-center justify-between">
							<p className="text-sm font-normal">
								{variant.label}
							</p>
							<div className="flex items-center gap-2">
								{variant.save && (
									<span className="rounded-full bg-success-500/20 px-2 py-0.5 text-xs font-semibold text-success-400">
										-{variant.save}
									</span>
								)}
								{variantAvailable === false && (
									<span className="rounded-full bg-danger-500/20 px-2 py-0.5 text-[11px] font-semibold text-danger-200">
										Hết hàng
									</span>
								)}
							</div>
						</div>
						<div className="mt-2 flex items-center justify-between text-xs text-ink-100/80">
							<span>{variant.bonus}</span>
							<span className="text-base font-normal text-ink-100">
								{variant.price
									? formatPrice(variant.price)
									: "Liên hệ"}
							</span>
						</div>
					</button>
				);
			})}
		</div>
	</div>
);

export default productList;
