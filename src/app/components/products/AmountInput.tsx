type AmountInputProps = {
	amount: number;
	setAmount: (amount: number) => void;
	error?: string[];
};

export const AmountInput = ({ amount, setAmount, error }: AmountInputProps) => {
	return (
		<div className="space-y-1 pt-1">
			<label
				className="block text-sm font-medium text-ink-50"
				htmlFor="order-amount">
				Số lượng (tối thiểu 10)
			</label>
			<input
				className="w-full px-3 border border-surface-600 rounded-2xl bg-surface-800 text-ink-100 focus:outline-none focus:ring-2 focus:ring-accent-500"
				id="order-amount"
				name="amount"
				type="number"
				min="10"
				value={amount}
				onChange={(e) => setAmount(Number(e.target.value))}
				required
			/>
			{error && <p className="text-sm text-red-500">{error[0]}</p>}
		</div>
	);
};
