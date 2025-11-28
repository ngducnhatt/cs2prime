"use server";

import { z } from "zod";

// --- Telegram API Configuration ---
// IMPORTANT: These should be stored in environment variables.
const botToken = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

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

// --- Server Action to Send Telegram Message ---
export async function sendTelegramOrder(
	prevState: FormState,
	formData: FormData,
): Promise<FormState> {
	if (!botToken || !chatId) {
		console.error("Telegram Bot Token or Chat ID is not configured.");
		return {
			message:
				"Lỗi cấu hình: Vui lòng thiết lập biến môi trường cho Telegram.",
			success: false,
		};
	}

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

	const {
		productName,
		unitPrice,
		totalAmount,
		amount,
		sellId,
		orderId,
	} = validatedFields.data;

	const formatPrice = (value: number) =>
		value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

	// --- Format the message for Telegram ---
	let bankInfo = "";
	if (!isBuyOrder) {
		const { bank, account, accountName } = validatedFields.data as z.infer<typeof SellOrderSchema>;
		bankInfo = `
**Ngân hàng:** \`${bank}\`
**Số tài khoản:** \`${account}\`
**Tên chủ tài khoản:** \`${accountName}\`
`;
	}

	const messageText = `
ĐƠN HÀNG MỚI
**Order ID:** \`${orderId}\`
**Sản phẩm:** ***${productName}***
**Đơn giá:** ${formatPrice(unitPrice)}
**Số lượng:** ${amount}
**THÀNH TIỀN:** \`${formatPrice(totalAmount)}\`
--------------------
**ID Bán:** \`${sellId}\`
${bankInfo}
--------------------
`;

	const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

	try {
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				chat_id: chatId,
				text: messageText,
				parse_mode: "Markdown",
			}),
		});

		const result = await response.json();

		if (!result.ok) {
			console.error("Telegram API error:", result);
			return {
				message: `Không gửi được đơn hàng. Lỗi từ Telegram: ${result.description}`,
				success: false,
			};
		}

		return {
			message: "Đơn hàng của bạn đã được gửi thành công!",
			success: true,
			data: validatedFields.data,
			timestamp: new Date().getTime(),
		};
	} catch (error) {
		console.error("Failed to send Telegram message:", error);
		return {
			message:
				"Không thể kết nối đến dịch vụ Telegram. Vui lòng thử lại sau.",
			success: false,
		};
	}
}
