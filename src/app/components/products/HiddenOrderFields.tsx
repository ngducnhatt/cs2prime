import { ProductVariant } from "@/lib/types";

type HiddenOrderFieldsProps = {
	selectedItem: ProductVariant;
	unitPrice: number;
	totalAmount: number;
	orderId: string;
};

export const HiddenOrderFields = ({
	selectedItem,
	unitPrice,
	totalAmount,
	orderId,
}: HiddenOrderFieldsProps) => {
	return (
		<>
			<input type="hidden" name="productName" value={selectedItem.label} />
			<input type="hidden" name="unitPrice" value={unitPrice} />
			<input type="hidden" name="totalAmount" value={totalAmount} />
			<input type="hidden" name="orderId" value={orderId} />
			<input type="hidden" name="selectedItemId" value={selectedItem.id} />
		</>
	);
};
