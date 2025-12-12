const botToken = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

type TelegramMessagePayload = {
	text: string;
	parse_mode?: "Markdown" | "HTML";
};

export const TelegramService = {
	async sendMessage(message: string): Promise<boolean> {
		if (!botToken || !chatId) {
			console.error("Telegram Config Missing: Check your env variables");
			return false;
		}

		const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
		const payload: TelegramMessagePayload = {
			text: message,
			parse_mode: "Markdown",
		};

		try {
			const response = await fetch(url, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ chat_id: chatId, ...payload }),
			});

			const result = await response.json();
			if (!result.ok) {
				console.error("Telegram API Error:", result);
				return false;
			}
			return true;
		} catch (error) {
			console.error("Telegram Fetch Error:", error);
			return false;
		}
	},

	formatOrderMessage(data: any, isBuyOrder: boolean): string {
		const formatPrice = (value: number) =>
			value.toLocaleString("vi-VN", {
				style: "currency",
				currency: "VND",
			});

		let bankInfo = "";
		if (!isBuyOrder && data.bank) {
			bankInfo = `
**Ngân hàng:** \`${data.bank}\`
**Số tài khoản:** \`${data.account}\`
**Tên chủ tài khoản:** \`${data.accountName}\`
`;
		}

		return `
ĐƠN HÀNG MỚI
**Order ID:** \`${data.orderId}\`
**Sản phẩm:** ***${data.productName}***
**Đơn giá:** ${formatPrice(data.unitPrice)}
**Số lượng:** ${data.amount}
**THÀNH TIỀN:** \`${formatPrice(data.totalAmount)}\`
--------------------
**ID Bán:** \`${data.sellId}\`
${bankInfo}
--------------------
`;
	},

	formatCheckoutMessage(data: any): string {
		const formatCurrency = (value: number) =>
			value.toLocaleString("vi-VN", {
				style: "currency",
				currency: "VND",
			});

		const itemsList = data.items
			.map(
				(item: any, index: number) =>
					`${index + 1}. **${item.name}**
       - SL: ${item.quantity}
       - Giá: ${item.price}
       ${item.note ? `- Note: ${item.note}` : ""}`,
			)
			.join("\n");

		return `
ĐƠN HÀNG CHECKOUT MỚI
**Order ID:** \`${data.orderId}\`
**Email:** \`${data.email}\`
**Ghi chú:** ${data.note || "Không có"}
--------------------
**Sản phẩm:**
${itemsList}
--------------------
**TỔNG TIỀN:** \`${formatCurrency(data.totalValue)}\`
`;
	},
};
