import type { Metadata } from "next";
import { League_Spartan } from "next/font/google";
import "./globals.css";

import Header from "@/app/components/UI/Header";
import Footer from "@/app/components/UI/Footer";
import { CartProvider } from "@/app/context/CartContext";
import ScrollTopButton from "./components/UI/ScrollTopButton";

const leagueSpartan = League_Spartan({
	variable: "--font-league-spartan",
	subsets: ["latin"],
	fallback: ["League Spartan Fallback"],
});

export const metadata: Metadata = {
	metadataBase: new URL("https://muacode.com"),
	title: {
		default: "Muacode.com - Mua code game, thẻ game, wallet uy tín",
		template: "%s | Muacode.com",
	},
	icons: {
		icon: "/favicon.ico",
		shortcut: "/favicon.ico",
		apple: "/favicon.ico",
	},
	description:
		"Nền tảng mua bán key Steam, giftcard Steam, code Steam Wallet; dịch vụ game và tài khoản game uy tín. Thanh toán nhanh, nhận hàng trong vài giây.",
	keywords: [
		"steam wallet",
		"giftcard steam",
		"mua code game",
		"thẻ game",
		"tài khoản game",
		"muacode",
	],
	openGraph: {
		type: "website",
		locale: "vi_VN",
		url: "https://muacode.com",
		siteName: "Muacode.com",
		images: [
			{
				url: "/assets/cs2prime.jpg", // Hình ảnh đại diện mặc định khi share
				width: 1200,
				height: 630,
				alt: "Muacode.com Banner",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		site: "@muacode",
		creator: "@muacode",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="vi" suppressHydrationWarning>
			<body
				className={`${leagueSpartan.variable} bg-[var(--bg-primary)] text-ink-50`}>
				<CartProvider>
					<div className="min-h-screen flex flex-col">
						<Header />
						<main className="flex-1 w-full max-w-6xl mx-auto">
							{children}
						</main>
						<Footer />
					</div>
					<ScrollTopButton />
				</CartProvider>
			</body>
		</html>
	);
}
