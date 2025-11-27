"use client";

import Link from "next/link";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";

type ProductSummaryProps = {
	quantity: number;
	total: number;
	available: boolean;
	onDecrease: () => void;
	onIncrease: () => void;
	onAddToCart: () => void;
	formatPrice: (value: number) => string;
};

const productOrrder = ({
	quantity,
	total,
	available,
	onDecrease,
	onIncrease,
	onAddToCart,
	formatPrice,
}: ProductSummaryProps) => (
	<aside className="space-y-4">
		<div className="rounded-2xl border border-surface-600 bg-surface-700 p-4 shadow-soft">
			<div className="flex items-center justify-between">
				<p className="text-sm font-normal text-ink-50">Số lượng</p>
				<div className="flex items-center gap-2">
					<button
						onClick={onDecrease}
						aria-label="Giảm số lượng">
						<CiCircleMinus />
					</button>
					<span className="min-w-[24px] text-center text-sm text-ink-50">
						{quantity}
					</span>
					<button
						onClick={onIncrease}
						aria-label="Tăng số lượng">
						<CiCirclePlus />
					</button>
				</div>
			</div>
			<div className="mt-3 rounded-xl border border-surface-600 bg-ink-950 p-3">
				<p className="text-sm font-semibold text-ink-50">Tạm tính</p>
				<p className="text-2xl font-normal text-ink-50">
					{formatPrice(total)}
				</p>

				<div className="mt-3 flex flex-col gap-2">
					<button
						disabled={!available}
						className="w-full rounded-3xl bg-info-400 px-4 py-2 text-sm font-medium text-ink-50 disabled:cursor-not-allowed disabled:bg-ink-800 disabled:text-ink-200"
						onClick={onAddToCart}>
						{available ? "Thêm vào giỏ hàng" : "Hết hàng"}
					</button>
					<button className="w-full rounded-3xl bg-white px-4 py-2 text-sm font-medium text-black ">
						<Link href="/checkout">Xem giỏ hàng</Link>
					</button>
				</div>
			</div>
		</div>
	</aside>
);

export default productOrrder;
