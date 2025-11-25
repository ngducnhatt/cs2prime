import type { Metadata } from "next";
import { League_Spartan } from "next/font/google";
import "./globals.css";

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { CartProvider } from "@/app/context/CartContext";
import ScrollTopButton from "./components/ScrollTopButton";

const leagueSpartan = League_Spartan({
	variable: "--font-league-spartan",
	subsets: ["latin"],
	fallback: ["League Spartan Fallback"],
});

export const metadata: Metadata = {
	title: {
		default: "Muacode.com Store",
		template: "%s | Muacode.com Store",
	},
	description: "Trang bán key, giftcard, game và dịch vụ số.",
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
						<main className="flex-1 w-full max-w-6xl mx-auto px-4 py-10 md:py-12">
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
