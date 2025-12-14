import type { Metadata } from "next";
import { League_Spartan } from "next/font/google";
import "./globals.css";

import Header from "@/app/components/home/Header";
import Footer from "@/app/components/home/Footer";
import { CartProvider } from "@/app/context/CartContext";
import ScrollTopButton from "./components/ScrollTopButton";

const leagueSpartan = League_Spartan({
	variable: "--font-league-spartan",
	subsets: ["latin"],
	fallback: ["League Spartan Fallback"],
});

export const metadata: Metadata = {
	metadataBase: new URL("https://cs2prime.store"),
	title: {
		default: "CS2Prime.store - Mua Prime CS2, Acc Faceit, Steam Wallet uy tín",
		template: "%s | CS2Prime.store",
	},
	icons: {
		icon: "/favicon.ico",
		shortcut: "/favicon.ico",
		apple: "/favicon.ico",
	},
	description:
		"CS2Prime - Hệ thống bán lẻ tài khoản Counter-Strike 2 Prime, Faceit Level cao, Steam Wallet và dịch vụ Steam uy tín hàng đầu Việt Nam. Bảo hành trọn đời, hỗ trợ 24/7.",
	keywords: [
		"cs2 prime",
		"mua acc cs2",
		"steam wallet",
		"faceit",
		"tài khoản game",
		"cs2prime",
		"csgo prime",
	],
	openGraph: {
		type: "website",
		locale: "vi_VN",
		url: "https://cs2prime.store",
		siteName: "CS2Prime.store",
		images: [
			{
				url: "/assets/cs2prime.jpg", // Hình ảnh đại diện mặc định khi share
				width: 1200,
				height: 630,
				alt: "CS2Prime.store Banner",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		site: "@cs2prime",
		creator: "@cs2prime",
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
				className={`${leagueSpartan.variable} bg-(--bg-primary) text-ink-50`}>
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
