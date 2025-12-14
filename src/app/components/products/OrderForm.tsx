"use client";

import { OrderFormProps } from "@/lib/types";
import { BuyForm } from "./BuyForm";
import { SellForm } from "./SellForm";

const OrderForm = ({ selectedItem, banks = [], categoryId }: OrderFormProps) => {
	if (!selectedItem) {
		return null;
	}
	const isBuyForm =
		selectedItem.id === "duelbuy" || selectedItem.id === "empirebuy";

	if (isBuyForm) {
		return <BuyForm selectedItem={selectedItem} banks={banks} categoryId={categoryId} />;
	}

	return <SellForm selectedItem={selectedItem} banks={banks} categoryId={categoryId} />;
};

export default OrderForm;
