"use client";

import { OrderFormProps } from "@/lib/types";
import { BuyForm } from "./BuyForm";
import { SellForm } from "./SellForm";

const OrderForm = ({ selectedItem, banks = [] }: OrderFormProps) => {
	if (!selectedItem) {
		return null;
	}
	const isBuyForm =
		selectedItem.id === "duelbuy" || selectedItem.id === "empirebuy";

	if (isBuyForm) {
		return <BuyForm selectedItem={selectedItem} banks={banks} />;
	}

	return <SellForm selectedItem={selectedItem} banks={banks} />;
};

export default OrderForm;
