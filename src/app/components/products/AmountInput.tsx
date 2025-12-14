type AmountInputProps = {
	amount: number;
	setAmount: (amount: number) => void;
	error?: string[];
	categoryId?: string;
};

export const AmountInput = ({ amount, setAmount, error, categoryId }: AmountInputProps) => {
	const isSpecialCategory = categoryId === "csgoempire" || categoryId === "duel";
	const minValue = isSpecialCategory ? 0.01 : 10;
	return (
		<div className="space-y-1 pt-1">
			<label
				className="block text-sm font-medium text-ink-50"
				htmlFor="order-amount">
				Số lượng (tối thiểu {minValue})
			</label>
			<input
				className="input"
				id="order-amount"
				name="amount"
				type="number"
				min={minValue}
				step={isSpecialCategory ? "0.01" : "1"}
				value={amount}
				onChange={(e) => setAmount(Number(e.target.value))}
				required
			/>
			{error && <p className="text-sm text-red-500">{error[0]}</p>}
		</div>
	);
};
