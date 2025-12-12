"use client";

import { useState, useActionState } from "react";
import { FormState, sendTelegramOrder } from "@/app/actions/telegram";
import { OrderFormProps } from "@/lib/types";
import { SubmitButton } from "@/app/components/SubmitButton";
import Image from "next/image";
import { HiddenOrderFields } from "./HiddenOrderFields";
import { AmountInput } from "./AmountInput";
import { SellIdInput } from "./SellIdInput";
import { OrderConfirmation } from "./OrderConfirmation";

export const BuyForm = ({ selectedItem }: OrderFormProps) => {
	// cho phép đổi orderId sau mỗi lần đóng popup
	const [orderId, setOrderId] = useState(() => `CS2PRIME${Date.now()}`);

	const initialState: FormState = { message: "", success: false, errors: {} };
	const [state, formAction] = useActionState(sendTelegramOrder, initialState);

	const [amount, setAmount] = useState(10);
	const unitPrice = selectedItem.price || 0;
	const totalAmount = unitPrice * amount;

	const [sellId, setSellId] = useState("");
	const [submissionKey, setSubmissionKey] = useState(0);

	// lưu orderId của đơn đã đóng popup
	const [dismissedOrderId, setDismissedOrderId] = useState<string | null>(
		null,
	);

	// dữ liệu đơn hàng trả về từ server action
	const orderData = state.success && state.data ? state.data : null;

	const qrBank = "970407"; // Techcombank BIN
	const qrAccount = "1122102102";

	// derive QR từ orderData, không dùng effect
	const qrCodeValue = orderData
		? `https://img.vietqr.io/image/${qrBank}-${qrAccount}-compact.png?amount=${orderData.totalAmount}&addInfo=${orderData.orderId}`
		: "";

	// chỉ show popup nếu có orderData và chưa bị dismiss cho order đó
	const showQrPopup = !!orderData && orderData.orderId !== dismissedOrderId;

	const handleClosePopup = () => {
		// đánh dấu đơn hiện tại đã đóng popup
		if (orderData) {
			setDismissedOrderId(orderData.orderId);
		}

		// reset form
		setAmount(10);
		setSellId("");
		setSubmissionKey(Date.now()); // force remount form

		// tạo orderId mới cho đơn tiếp theo
		setOrderId(`CS2PRIME${Date.now()}`);
	};

	return (
		<div className="box p-5">
			<form key={submissionKey} action={formAction} className="space-y-4">
				<HiddenOrderFields
					selectedItem={selectedItem}
					unitPrice={unitPrice}
					totalAmount={totalAmount}
					orderId={orderId}
				/>

				<AmountInput
					amount={amount}
					setAmount={setAmount}
					error={state.errors?.amount}
				/>

				<SellIdInput
					sellId={sellId}
					setSellId={setSellId}
					error={state.errors?.sellId}
				/>

				<OrderConfirmation
					selectedItem={selectedItem}
					totalAmount={totalAmount}
				/>

				<SubmitButton />

				{state.message && (
					<p
						className={`mt-4 text-sm ${
							state.success ? "text-green-500" : "text-red-500"
						}`}>
						{state.message}
					</p>
				)}
			</form>

			{showQrPopup && qrCodeValue && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
					<div className="box relative w-full max-w-sm bg-surface-700 p-6 shadow-2xl animate-in fade-in zoom-in duration-200 md:max-w-2xl">
						<button
							onClick={handleClosePopup}
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
										src={qrCodeValue}
										alt="VietQR Payment"
										fill
										className="object-contain p-2"
										unoptimized
									/>
								</div>
								<p className="mt-4 text-center text-sm font-medium text-ink-50">
									Số tiền: {totalAmount.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
								</p>
							</div>
							<div className="space-y-4">
								<div className="text-sm text-ink-100/80">
									<p>
										- Vui lòng sử dụng ứng dụng ngân hàng của
										bạn để quét mã QR này để thanh toán.
									</p>
									<p className="mt-2">
										Sau khi chuyển khoản thành công, vui lòng kiểm tra tài khoản của bạn
									</p>
									<p className="mt-2 text-yellow-300">
										Lưu ý: Nếu sau 10 phút bạn chưa nhận
										được coin/value, vui lòng liên hệ bộ phận hỗ
										trợ để được giúp đỡ.
									</p>
								</div>
								<button
									onClick={handleClosePopup}
									type="button"
									className="btn btn-primary mt-6 w-full">
									Đóng
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
