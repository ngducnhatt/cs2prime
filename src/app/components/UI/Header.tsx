"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState, useSyncExternalStore } from "react";

import { useCart } from "@/app/context/CartContext";
import { CiMenuBurger } from "react-icons/ci";
import { IoIosCart } from "react-icons/io";

// 1. Định nghĩa Data tĩnh bên ngoài để tránh khởi tạo lại khi re-render
type NavLinkItem = { label: string; href: string };

const navLinks: NavLinkItem[] = [
	{ label: "Steam Wallet Code", href: "/products/steam" },
	{ label: "CsgoEmpire", href: "/products/csgoempire" },
	{ label: "Duel.com", href: "/products/duel" },
	{ label: "Faceit", href: "/products/faceit" },
	{ label: "Tài khoản game", href: "/products/accountgame" },
	{ label: "Dịch vụ", href: "/services" },
];

const emptySubscribe = () => () => {};

// 2. Tách Component CartLink để tái sử dụng cho cả Mobile và Desktop
const CartLink = ({
	count,
	isMounted,
	className = "",
}: {
	count: number;
	isMounted: boolean;
	className?: string;
}) => (
	<Link
		href="/checkout"
		className={`flex items-center gap-2 rounded-full border border-surface-600 px-4 py-2 transition ${className}`}>
		<IoIosCart className="text-xl" />
		{isMounted && count > 0 && (
			<span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-ink-100 px-1.5 text-xs font-bold text-[#0b0b0b]">
				{count}
			</span>
		)}
	</Link>
);

const Header = () => {
	const pathname = usePathname();
	const [open, setOpen] = useState(false);
	const { items } = useCart();

	const isMounted = useSyncExternalStore(
		emptySubscribe,
		() => true,
		() => false,
	);

	const cartCount = useMemo(
		() => items.reduce((sum, item) => sum + item.quantity, 0),
		[items],
	);

	return (
		<header className="sticky top-0 z-40 border-b border-surface-600 bg-surface-700">
			{/* Top Bar */}
			<div className=" hidden border-b border-surface-600 bg-surface-900 px-4 py-2 text-xs text-ink-200/50 md:block">
				<div className="px-4 mx-auto flex max-w-6xl items-center justify-between">
					<div className="flex gap-4">
						{["/news", "/contact", "/"].map((href, index) => (
							<Link
								key={href}
								href={href}
								className="hover:text-ink-100 transition-colors">
								{index === 0
									? "Tin tức"
									: index === 1
									? "Hỗ trợ"
									: "Hướng dẫn mua hàng"}
							</Link>
						))}
					</div>
				</div>
			</div>

			{/* Main Header */}
			<div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 md:py-4">
				<Link href="/">
					<Image
						src="https://pub-f0a6dec73e084e83be3f5ea518ee5da7.r2.dev/logo.png"
						alt="CS2Prime logo"
						width={32}
						height={32}
						className="h-auto w-auto"
						priority
						onClick={() => setOpen(false)}
					/>
				</Link>

				{/* Mobile Menu Button */}
				<button
					type="button"
					className="ml-auto flex h-10 w-10 items-center justify-center rounded-full border border-surface-600 text-ink-100 md:hidden"
					onClick={() => setOpen((v) => !v)}
					aria-label="Mở menu">
					<CiMenuBurger />
				</button>

				{/* Navigation */}
				<nav
					className={`${
						open ? "flex" : "hidden"
					} absolute left-0 right-0 top-full flex-col gap-2 rounded-b-2xl border border-surface-600 bg-surface-700 px-4 pb-5 pt-3 shadow-lg md:static md:flex md:flex-1 md:flex-row md:items-center md:justify-center md:gap-2 md:border-none md:bg-transparent md:p-0 md:shadow-none`}
					aria-label="Điều hướng">
					{navLinks.map((link) => {
						const isActive = pathname === link.href.split("#")[0];
						return (
							<Link
								key={link.href}
								href={link.href}
								className={`rounded-full px-3 py-2 text-sm font-semibold transition hover:bg-white/20 ${
									isActive
										? "bg-white/10 text-ink-50"
										: "text-ink-100/80"
								}`}
								onClick={() => setOpen(false)}>
								{link.label}
							</Link>
						);
					})}

					{/* Mobile Only Links */}
					<div className="mt-2 flex flex-col gap-2 border-t border-surface-600 pt-3 md:hidden">
						<CartLink
							count={cartCount}
							isMounted={isMounted}
							className="justify-center"
						/>
						<Link
							href="/contact"
							onClick={() => setOpen(false)}
							className="flex justify-center rounded-full bg-ink-100 px-4 py-2 text-sm font-semibold text-[#0b0b0b] shadow-soft transition">
							Hỗ trợ
						</Link>
					</div>
				</nav>

				{/* Desktop Buttons */}
				<div className="hidden items-center gap-3 md:flex">
					<CartLink count={cartCount} isMounted={isMounted} />
					<Link
						href="/contact"
						className="rounded-full bg-ink-100 px-4 py-2 text-sm font-semibold text-[#0b0b0b] shadow-soft transition hover:bg-ink-50">
						Hỗ trợ
					</Link>
				</div>
			</div>
		</header>
	);
};

export default Header;
