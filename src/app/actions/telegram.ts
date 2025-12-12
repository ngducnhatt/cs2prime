"use server";

import { z } from "zod";
import { TelegramService } from "@/services/telegramService";

// --- Input Validation Schemas ---
const BaseOrderSchema = z.object({
	productName: z.string(),
	unitPrice: z.coerce.number(),
	totalAmount: z.coerce.number(),
	amount: z.coerce.number().min(1, "Số lượng không hợp lệ"),
	sellId: z.string().min(1, "ID Bán là bắt buộc"),
	orderId: z.string(),
	selectedItemId: z.string(),
});

const BuyOrderSchema = BaseOrderSchema;

const SellOrderSchema = BaseOrderSchema.extend({
	bank: z.string().min(1, "Ngân hàng là bắt buộc."),
	account: z.string().min(1, "Số tài khoản là bắt buộc."),
	accountName: z.string().min(1, "Tên tài khoản là bắt buộc."),
});

const CheckoutOrderSchema = z.object({
	email: z.string().email("Email không hợp lệ"),
	note: z.string().optional(),
	totalValue: z.coerce.number(),
	orderId: z.string(),
	items: z.array(
		z.object({
			id: z.string(),
			name: z.string(),
			price: z.string(),
			quantity: z.number(),
			note: z.string().optional(),
		}),
	),
});

export type FormState = {
	message: string;
	errors?: Record<string, string[] | undefined>;
	success: boolean;
	data?: z.infer<typeof BaseOrderSchema> & {
		bank?: string;
		account?: string;
		accountName?: string;
	};
	timestamp?: number;
};

// --- Server Action: Quick Buy/Sell ---
export async function sendTelegramOrder(
	prevState: FormState,
	formData: FormData,
): Promise<FormState> {
	const selectedItemId = formData.get("selectedItemId") as string;
	const isBuyOrder =
		selectedItemId === "duelbuy" || selectedItemId === "empirebuy";

	const schema = isBuyOrder ? BuyOrderSchema : SellOrderSchema;

	const validatedFields = schema.safeParse({
		productName: formData.get("productName"),
		unitPrice: formData.get("unitPrice"),
		totalAmount: formData.get("totalAmount"),
		amount: formData.get("amount"),
		sellId: formData.get("id"),
		bank: formData.get("bank"),
		account: formData.get("account"),
		accountName: formData.get("name"),
		orderId: formData.get("orderId"),
		selectedItemId: formData.get("selectedItemId"),
	});

	if (!validatedFields.success) {
		return {
			message: "Vui lòng kiểm tra lại các trường đã nhập.",
			errors: validatedFields.error.flatten().fieldErrors,
			success: false,
		};
	}

	// Logic gọi Telegram đã được tách ra Service
	const messageText = TelegramService.formatOrderMessage(
		validatedFields.data,
		isBuyOrder,
	);
	const isSent = await TelegramService.sendMessage(messageText);

	if (!isSent) {
		return {
			message:
				"Không thể kết nối đến dịch vụ Telegram. Vui lòng thử lại sau.",
			success: false,
		};
	}

	return {
		message: "Đơn hàng của bạn đã được gửi thành công!",
		success: true,
		data: validatedFields.data,
		timestamp: new Date().getTime(),
	};
}

// --- Server Action: Checkout Cart ---
export async function sendTelegramCheckoutOrder(
	data: z.infer<typeof CheckoutOrderSchema>,
): Promise<{ success: boolean; message: string }> {
	const validation = CheckoutOrderSchema.safeParse(data);

	if (!validation.success) {
		return {
			message: "Dữ liệu không hợp lệ.",
			success: false,
		};
	}

	// Logic gọi Telegram đã được tách ra Service
	const messageText = TelegramService.formatCheckoutMessage(validation.data);
	const isSent = await TelegramService.sendMessage(messageText);

	if (!isSent) {
		return {
			message: "Lỗi kết nối hoặc cấu hình bot Telegram.",
			success: false,
		};
	}

	return {
		message: "Đơn hàng đã được gửi thành công!",
		success: true,
	};
}
