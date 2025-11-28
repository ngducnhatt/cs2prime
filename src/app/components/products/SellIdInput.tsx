type SellIdInputProps = {
	sellId: string;
	setSellId: (id: string) => void;
	error?: string[];
};

export const SellIdInput = ({ sellId, setSellId, error }: SellIdInputProps) => {
	return (
		<div className="space-y-1">
			<label
				className="block text-sm font-medium text-ink-50"
				htmlFor="order-id">
				ID Bán (id steam)
			</label>
			<input
				className="w-full px-3 border border-surface-600 rounded-2xl bg-surface-800 text-ink-100 focus:outline-none focus:ring-2 focus:ring-accent-500"
				id="order-id"
				name="id"
				type="text"
				required
				value={sellId}
				onChange={(e) => setSellId(e.target.value)}
			/>
			{error && <p className="text-sm text-red-500">{error[0]}</p>}
		</div>
	);
};
