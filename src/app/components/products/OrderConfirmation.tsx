import { ProductVariant } from "@/lib/types";

const formatPrice = (value: number) =>
	value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

type OrderConfirmationProps = {
	selectedItem: ProductVariant;
	totalAmount: number;
};

export const OrderConfirmation = ({
	selectedItem,
	totalAmount,
}: OrderConfirmationProps) => {
	const unitPrice = selectedItem.price || 0;

	return (
		<div className="mb-6 pt-3 border-t border-surface-600">
			<div className="text-lg font-semibold text-ink-50 mb-4">
				Xác nhận đơn hàng
			</div>
			<div className="space-y-3">
				<div className="flex justify-between items-center text-sm">
					<span className="text-ink-100">Sản phẩm</span>
					<span className="font-medium text-ink-50">
						{selectedItem.label}
					</span>
				</div>
				<div className="flex justify-between items-center text-sm">
					<span className="text-ink-100">Đơn giá</span>
					<span className="font-medium text-ink-50">
						{formatPrice(unitPrice)}
					</span>
				</div>
				<div className="flex justify-between items-center text-base font-semibold pt-2 border-t border-surface-600">
					<span className="text-ink-50">Thành tiền</span>
					<span className="text-accent-500">
						{formatPrice(totalAmount)}
					</span>
				</div>
			</div>
		</div>
	);
};
