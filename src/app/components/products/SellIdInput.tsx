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
				ID của bạn
			</label>
			<input
				className="input"
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
