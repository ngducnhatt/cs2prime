"use client";

import { useState, useEffect, useActionState } from "react";
import { FormState, sendTelegramOrder } from "@/app/actions/telegram";
import { OrderFormProps } from "@/lib/types";
import { SubmitButton } from "@/app/components/SubmitButton";
import Image from "next/image";
import { HiddenOrderFields } from "./HiddenOrderFields";
import { AmountInput } from "./AmountInput";
import { SellIdInput } from "./SellIdInput";
import { OrderConfirmation } from "./OrderConfirmation";

export const BuyForm = ({ selectedItem }: OrderFormProps) => {
	const [orderId] = useState(() => `MUACODE${Date.now()}`);
	const initialState: FormState = { message: "", success: false, errors: {} };
	const [state, formAction] = useActionState(sendTelegramOrder, initialState);

	const [amount, setAmount] = useState(10);
	const unitPrice = selectedItem.price || 0;
	const totalAmount = unitPrice * amount;

	const [sellId, setSellId] = useState("");
	const [submissionKey, setSubmissionKey] = useState(0);

	const [showQrPopup, setShowQrPopup] = useState(false);
	const [qrCodeValue, setQrCodeValue] = useState("");

	useEffect(() => {
		if (state.success && state.data) {
			const qrBank = "970407"; // Techcombank BIN
			const qrAccount = "1122102102";
			const qrAddInfo = `${state.data.orderId}`;
			const qrLink = `https://img.vietqr.io/image/${qrBank}-${qrAccount}-compact.png?amount=${state.data.totalAmount}&addInfo=${qrAddInfo}`;
			setQrCodeValue(qrLink);
			setShowQrPopup(true);
		}
	}, [state]);

	const handleClosePopup = () => {
		setShowQrPopup(false);
		setAmount(10);
		setSellId("");
		setSubmissionKey(Date.now());
	};

	return (
		<div className="rounded-2xl border border-surface-600 bg-surface-700 px-5 shadow-soft">
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
						className={`text-sm mt-4 ${
							state.success ? "text-green-500" : "text-red-500"
						}`}>
						{state.message}
					</p>
				)}
			</form>
			{showQrPopup && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
					<div className="relative rounded-3xl card p-6 shadow-lg">
						<h3 className="mb-4 text-lg font-bold">
							Quét mã QR để thanh toán
						</h3>
						<div className="flex justify-center p-4">
							<Image
								src={qrCodeValue}
								alt="QR Code for payment"
								width={256}
								height={256}
							/>
						</div>
						<button
							onClick={handleClosePopup}
							className="mt-4 w-full bg-red-500 py-2 text-white hover:bg-red-600">
							Đóng
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

