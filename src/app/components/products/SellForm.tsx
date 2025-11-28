"use client";

import React, { useState, useActionState } from "react";
import { FormState, sendTelegramOrder } from "@/app/actions/telegram";
import { OrderFormProps } from "@/lib/types";
import { SubmitButton } from "@/app/components/SubmitButton";
import { HiddenOrderFields } from "./HiddenOrderFields";
import { AmountInput } from "./AmountInput";
import { SellIdInput } from "./SellIdInput";
import { OrderConfirmation } from "./OrderConfirmation";

export const SellForm = ({
	selectedItem,
	banks = [],
}: OrderFormProps) => {
	const [orderId] = useState(() => `MUACODE${Date.now()}`);
	const initialState: FormState = { message: "", success: false, errors: {} };
	const [state, formAction] = useActionState(sendTelegramOrder, initialState);

	const [amount, setAmount] = useState(10);
	const unitPrice = selectedItem.price || 0;
	const totalAmount = unitPrice * amount;

	const [bankValue, setBankValue] = useState("");
	const [sellId, setSellId] = useState("");
	const [accountValue, setAccountValue] = useState("");
	const [accountNameValue, setAccountNameValue] = useState("");

	const [submissionKey, setSubmissionKey] = useState(0);

	const [copied, setCopied] = useState(false);
	const MY_ID_STEAM = "76561199874889649";

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
		<div className="rounded-2xl border border-surface-600 bg-surface-700 px-5 shadow-soft">
			<form key={submissionKey} action={formAction} className="space-y-4">
				{(selectedItem.id === "empiresell" ||
					selectedItem.id === "duelsell") && (
					<div className="text-xl text-ink-100 mt-5">
						<h3>ID nhận</h3>
						<div className="mt-2 flex flex-wrap gap-2">
							<button
								onClick={HandleCopyId}
								className="rounded-full bg-surface-700 px-3 py-1 text-sm font-medium text-ink-50 transition hover:border-ink-100 hover:bg-surface-600"
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
						className="w-full px-3 border border-surface-600 rounded-2xl bg-surface-800 text-ink-100 focus:outline-none focus:ring-2 focus:ring-accent-500"
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
						className="w-full px-3 border border-surface-600 rounded-2xl bg-surface-800 text-ink-100 focus:outline-none focus:ring-2 focus:ring-accent-500"
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
						className="w-full px-3 border border-surface-600 rounded-2xl bg-surface-800 text-ink-100 focus:outline-none focus:ring-2 focus:ring-accent-500"
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
