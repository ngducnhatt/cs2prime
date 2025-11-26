"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

import { useCart } from "@/app/context/CartContext";

const formatCurrency = (value: number) =>
	value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const CheckoutPage = () => {
	const { items, removeFromCart, updateQuantity, clearCart, totalValue } =
		useCart();
	const [email, setEmail] = useState("");
	const [note, setNote] = useState("");
	const [message, setMessage] = useState("");

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		if (!email) return;
		setMessage(
			"Đã nhận yêu cầu thanh toán. Vui lòng kiểm tra email trong ít phút.",
		);
		setTimeout(() => {
			clearCart();
		}, 500);
	};

	return (
		<div className="space-y-6">
			<header className="rounded-2xl border border-surface-600 bg-surface-700 p-6 shadow-soft">
				<h1 className="mt-2 text-2xl font-bold text-ink-50">
					Thanh toán đơn hàng
				</h1>
				<p className="text-sm text-ink-100/80">
					Nhập email để nhận key/giftcard ngay sau khi hoàn tất thanh toán.
				</p>
			</header>

			<div className="grid gap-6 lg:grid-cols-[1.4fr,1fr]">
				<section className="space-y-4 rounded-2xl border border-surface-600 bg-surface-700 p-5 shadow-soft">
					<h2 className="text-lg font-semibold text-ink-50">
						Sản phẩm
					</h2>
					{items.length === 0 ? (
						<div className="rounded-xl border border-surface-600 bg-ink-800/60 p-4 text-sm text-ink-100/80">
							Giỏ hàng trống.{" "}
							<Link
								href="/products"
								className="font-semibold text-ink-50 underline">
								Xem sản phẩm
							</Link>
						</div>
					) : (
						<ul className="space-y-3">
							{items.map((item) => (
								<li
									key={item.id}
									className="flex flex-col gap-3 rounded-xl border border-surface-600 bg-ink-800/60 p-3 sm:flex-row sm:items-center sm:justify-between">
									<div>
										<p className="font-semibold text-ink-50">
											{item.name}
										</p>
										<p className="text-sm text-ink-100/80">
											{item.price}
										</p>
										{item.note && (
											<p className="text-xs text-ink-200/70">
												Ghi chú: {item.note}
											</p>
										)}
									</div>
									<div className="flex items-center gap-2">
										<label
											className="text-xs text-ink-100/70"
											htmlFor={`qty-${item.id}`}>
											SL
										</label>
										<input
											id={`qty-${item.id}`}
											type="number"
											min={1}
											value={item.quantity}
											onChange={(e) =>
												updateQuantity(
													item.id,
													Number(e.target.value),
												)
											}
											className="w-16 rounded-md border border-ink-700 bg-surface-700 px-2 py-1 text-sm text-ink-50 focus:border-ink-50 focus:outline-none"
										/>
										<button
											type="button"
											className="rounded-md border border-ink-700 px-3 py-1 text-xs font-semibold text-ink-50 hover:border-ink-50"
											onClick={() =>
												removeFromCart(item.id)
											}>
											Xóa
										</button>
									</div>
								</li>
							))}
						</ul>
					)}
				</section>

				<section className="space-y-4 rounded-2xl border border-surface-600 bg-surface-700 p-5 shadow-soft">
					<h2 className="text-lg font-semibold text-ink-50">
						Thông tin thanh toán
					</h2>
					<form className="space-y-4" onSubmit={handleSubmit}>
						<div className="space-y-1">
							<label
								htmlFor="email"
								className="text-sm font-semibold text-ink-50">
								Email nhận sản phẩm
							</label>
							<input
								id="email"
								type="email"
								required
								placeholder="you@example.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="w-full rounded-xl border border-ink-700 bg-surface-700 px-3 py-2 text-ink-50 placeholder:text-ink-100/50 focus:border-ink-50 focus:outline-none"
							/>
						</div>
						<div className="space-y-1">
							<label
								htmlFor="note"
								className="text-sm font-semibold text-ink-50">
								Ghi chú (tuỳ chọn)
							</label>
							<textarea
								id="note"
								rows={3}
								value={note}
								onChange={(e) => setNote(e.target.value)}
								placeholder="Ví dụ: yêu cầu xuất hoá đơn, đổi giờ giao..."
								className="w-full rounded-xl border border-ink-700 bg-surface-700 px-3 py-2 text-ink-50 placeholder:text-ink-100/50 focus:border-ink-50 focus:outline-none"
							/>
						</div>
						<div className="rounded-xl border border-surface-600 bg-ink-800/60 p-3 text-sm text-ink-100/80">
							<div className="flex items-center justify-between">
								<span>Tạm tính</span>
								<span className="font-semibold text-ink-50">
									{formatCurrency(totalValue)}
								</span>
							</div>
							<div className="flex items-center justify-between">
								<span>Phí xử lý</span>
								<span className="text-ink-100/70">
									Miễn phí
								</span>
							</div>
						</div>
						<button
							type="submit"
							disabled={items.length === 0}
							className="w-full rounded-3xl bg-ink-100 px-4 py-3 text-sm font-semibold text-ink-900 transition hover:-translate-y-0.5 hover:bg-ink-50 disabled:cursor-not-allowed disabled:bg-ink-700 disabled:text-ink-100">
							Thanh toán
						</button>
						{message && (
							<p className="text-sm text-ink-50">{message}</p>
						)}
					</form>
				</section>
			</div>
		</div>
	);
};

export default CheckoutPage;
