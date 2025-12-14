"use client";

import React, { useState, useActionState } from "react";
import { FormState, sendTelegramOrder } from "@/app/actions/telegram";
import { OrderFormProps } from "@/lib/types";
import { SubmitButton } from "@/app/components/SubmitButton";
import { HiddenOrderFields } from "./HiddenOrderFields";
import { AmountInput } from "./AmountInput";
import { SellIdInput } from "./SellIdInput";
import { OrderConfirmation } from "./OrderConfirmation";

export const SellForm = ({ selectedItem, banks = [], categoryId }: OrderFormProps) => {
	const [orderId] = useState(() => `CS2PRIME${Date.now()}`);
	const initialState: FormState = { message: "", success: false, errors: {} };
	const [state, formAction] = useActionState(sendTelegramOrder, initialState);

	const isSpecialCategory = categoryId === "csgoempire" || categoryId === "duel";
	const initialAmount = isSpecialCategory ? 0.01 : 10;
	const [amount, setAmount] = useState(initialAmount);
	const unitPrice = selectedItem.price || 0;
	const totalAmount = unitPrice * amount;

	const [bankValue, setBankValue] = useState("");
	const [sellId, setSellId] = useState("");
	const [accountValue, setAccountValue] = useState("");
	const [accountNameValue, setAccountNameValue] = useState("");

	const [submissionKey, setSubmissionKey] = useState(0);

	const [copied, setCopied] = useState(false);
	const MY_ID_STEAM =
		selectedItem.id === "empiresell"
			? "76561198769102278"
			: selectedItem.id === "duelsell"
			? "qexc"
			: "";

	const HandleCopyId = async () => {
		try {
			await navigator.clipboard.writeText(MY_ID_STEAM);
			setCopied(true);
		} catch {
			setCopied(false);
		} finally {
			setTimeout(() => setCopied(false), 1500);
		}
	};

	return (
		<div className="box p-5">
			<form key={submissionKey} action={formAction} className="space-y-4">
				{(selectedItem.id === "empiresell" ||
					selectedItem.id === "duelsell") && (
					<div className="text-xl">
						<h3>ID nhận</h3>
						<div className="mt-2 flex flex-wrap gap-2">
							<button
								onClick={HandleCopyId}
								className="btn btn-primary px-3 py-1 rounded-full"
								title="Đã copy ID Steam">
								{copied ? "Đã copy!" : MY_ID_STEAM}
							</button>
						</div>
					</div>
				)}

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
					categoryId={categoryId}
				/>
				<SellIdInput
					sellId={sellId}
					setSellId={setSellId}
					error={state.errors?.sellId}
				/>

				<div className="space-y-1">
					<label
						className="block text-sm font-medium text-ink-50"
						htmlFor="order-bank">
						Ngân hàng
					</label>
					<input
						className="input"
						id="order-bank"
						name="bank"
						type="text"
						list="bank-list"
						required
						value={bankValue}
						onChange={(e) => setBankValue(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								e.preventDefault();
								const match = banks.find(
									(b) =>
										b.shortName
											.toLowerCase()
											.startsWith(
												bankValue.toLowerCase(),
											) ||
										b.name
											.toLowerCase()
											.startsWith(
												bankValue.toLowerCase(),
											),
								);
								if (match) {
									setBankValue(match.shortName);
								}
							}
						}}
					/>
					<datalist id="bank-list">
						{(banks || []).map((bank) => (
							<option key={bank.bin} value={bank.shortName}>
								{bank.name}
							</option>
						))}
					</datalist>
					{state.errors?.bank && (
						<p className="text-sm text-red-500">
							{state.errors.bank[0]}
						</p>
					)}
				</div>

				<div className="space-y-1">
					<label
						className="block text-sm font-medium text-ink-50"
						htmlFor="order-account">
						Số tài khoản
					</label>
					<input
						className="input"
						id="order-account"
						name="account"
						type="text"
						required
						value={accountValue}
						onChange={(e) => setAccountValue(e.target.value)}
					/>
					{state.errors?.account && (
						<p className="text-sm text-red-500">
							{state.errors.account[0]}
						</p>
					)}
				</div>

				<div className="space-y-1">
					<label
						className="block text-sm font-medium text-ink-50"
						htmlFor="order-name">
						Tên tài khoản ngân hàng
					</label>
					<input
						className="input"
						id="order-name"
						name="name"
						type="text"
						required
						value={accountNameValue}
						onChange={(e) => setAccountNameValue(e.target.value)}
					/>
					{state.errors?.accountName && (
						<p className="text-sm text-red-500">
							{state.errors.accountName[0]}
						</p>
					)}
				</div>

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
		</div>
	);
};
