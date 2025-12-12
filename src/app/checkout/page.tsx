"use client";

import Link from "next/link";
import Image from "next/image";
import { FormEvent, useState } from "react";

import { useCart } from "@/app/context/CartContext";
import { sendTelegramCheckoutOrder } from "@/app/actions/telegram";

const formatCurrency = (value: number) =>
	value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const CheckoutPage = () => {
	const { items, removeFromCart, updateQuantity, clearCart, totalValue } =
		useCart();
	const [email, setEmail] = useState("");
	const [note, setNote] = useState("");
	const [message, setMessage] = useState("");
	const [isProcessing, setIsProcessing] = useState(false);
	const [showQrModal, setShowQrModal] = useState(false);
	const [qrUrl, setQrUrl] = useState("");

	const handlePayment = async (e: FormEvent) => {
		e.preventDefault();
		if (!email) return;

		setIsProcessing(true);
		setMessage("");

		const orderId = `ORDER_${Date.now()}`;
		const orderTime = new Date().toISOString();

		// 1. Gửi thông báo Telegram
		const result = await sendTelegramCheckoutOrder({
			email,
			note,
			totalValue,
			orderId,
			items,
		});

		if (result.success) {
			// 2. Tạo URL QR Code
			const qrBank = "970407"; // Techcombank BIN
			const qrAccount = "1122102102";
			const addInfoRaw = `${email} ${orderTime}`;
			const addInfo = btoa(addInfoRaw).replace(/=+$/, ""); // Base64 & remove '='
			const url = `https://img.vietqr.io/image/${qrBank}-${qrAccount}-compact.png?amount=${totalValue}&addInfo=${addInfo}`;

			setQrUrl(url);
			setShowQrModal(true);
			setMessage(
				"Đã nhận yêu cầu. Vui lòng quét mã QR để hoàn tất thanh toán.",
			);
			clearCart();
		} else {
			setMessage(result.message || "Có lỗi xảy ra. Vui lòng thử lại.");
		}

		setIsProcessing(false);
	};

	return (
		<div className="space-y-6 p-4">
			<div className="grid gap-6 lg:grid-cols-[1.4fr,1fr]">
				<section className="box space-y-4 p-5 text-ink-50">
					<h2 className="text-lg text-ink-50">Sản phẩm</h2>
					{items.length === 0 ? (
						<div className="box bg-ink-800/60 p-4 text-sm text-ink-100/80">
							Giỏ hàng trống.{" "}
							<Link
								href="/products"
								className="text-ink-50 underline">
								Xem sản phẩm
							</Link>
						</div>
					) : (
						<ul className="space-y-3">
							{items.map((item) => (
								<li
									key={item.id}
									className="box flex flex-col gap-3 bg-ink-800/60 p-3 sm:flex-row sm:items-center sm:justify-between">
									<div>
										<p className="text-ink-50">
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
											className="input w-16 py-1 text-sm"
										/>
										<button
											type="button"
											className="btn btn-ghost px-3 py-1 text-xs"
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

				<section className="box space-y-4 p-5 text-ink-50">
					<h2 className="text-lg text-ink-50">
						Thông tin thanh toán
					</h2>
					<form className="space-y-4" onSubmit={handlePayment}>
						<div className="space-y-1">
							<label
								htmlFor="email"
								className="text-sm text-ink-50">
								Email nhận sản phẩm
							</label>
							<input
								id="email"
								type="email"
								required
								placeholder="you@example.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="input"
							/>
						</div>
						<div className="space-y-1">
							<label
								htmlFor="note"
								className="text-sm text-ink-50">
								Ghi chú (tuỳ chọn)
							</label>
							<textarea
								id="note"
								rows={3}
								value={note}
								onChange={(e) => setNote(e.target.value)}
								placeholder="Ví dụ: yêu cầu xuất hoá đơn, đổi giờ giao..."
								className="input"
							/>
						</div>
						<div className="box bg-ink-800/60 p-3 text-sm text-ink-100/80">
							<div className="flex items-center justify-between">
								<span>Tạm tính</span>
								<span className="text-ink-50">
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
							disabled={items.length === 0 || isProcessing}
							className="btn btn-primary w-full py-3 text-sm font-semibold">
							{isProcessing ? "Đang xử lý..." : "Thanh toán"}
						</button>
						{message && (
							<p className="text-sm text-ink-50">{message}</p>
						)}
					</form>
				</section>
			</div>
			{/* QR Code Modal */}
			{showQrModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
					<div className="box relative w-full max-w-sm bg-surface-700 p-6 shadow-2xl animate-in fade-in zoom-in duration-200 md:max-w-2xl">
						<button
							onClick={() => setShowQrModal(false)}
							className="absolute right-4 top-4 text-ink-100 hover:text-ink-50">
							✕
						</button>
						<h3 className="mb-4 text-center text-xl text-ink-50">
							Quét mã để thanh toán
						</h3>
						<div className="grid gap-4 md:grid-cols-2">
							<div className="flex flex-col items-center">
								<div className="aspect-square relative w-full overflow-hidden rounded-xl bg-white">
									<Image
										src={qrUrl}
										alt="VietQR Payment"
										fill
										className="object-contain p-2"
										unoptimized
									/>
								</div>
								<p className="mt-4 text-center text-sm font-medium text-ink-50">
									Số tiền: {formatCurrency(totalValue)}
								</p>
							</div>
							<div className="space-y-4">
								<div className="text-sm text-ink-100/80">
									<p>
										Vui lòng sử dụng ứng dụng ngân hàng của
										bạn để quét mã QR này để thanh toán.
									</p>
									<p className="mt-2">
										Sau khi chuyển khoản thành công, vui
										lòng kiểm tra email của bạn để nhận sản
										phẩm.
									</p>
									<p className="mt-2 text-yellow-300">
										Lưu ý: Nếu sau 10 phút bạn chưa nhận
										được email, vui lòng liên hệ bộ phận hỗ
										trợ để được giúp đỡ.
									</p>
								</div>
								<button
									onClick={() => setShowQrModal(false)}
									className="btn btn-primary mt-6 w-full">
									Đóng
								</button>
							</div>
						</div>
					</div>
				</div>
			)}{" "}
		</div>
	);
};

export default CheckoutPage;
