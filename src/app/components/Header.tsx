"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

import { useCart } from "@/app/context/CartContext";
import productsData from "@/data/products.json";
import servicesData from "@/data/services.json";
import { CiMenuBurger } from "react-icons/ci";
import { IoIosCart } from "react-icons/io";

type NavLinkItem = { label: string; href: string };

const Header = () => {
	const pathname = usePathname();
	const [open, setOpen] = useState(false);
	const { items } = useCart();
	const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

	const navLinks: NavLinkItem[] = useMemo(() => {
		const productLinks =
			(productsData.categories || []).map((cat: any) => ({
				label: cat.label,
				href: cat.href || `/products/${cat.id}`,
			})) || [];

		const serviceLinks =
			(servicesData.services || []).map((svc: any) => ({
				label: svc.title,
				href: `/services#${svc.id}`,
			})) || [];

		return [...productLinks, ...serviceLinks];
	}, []);

	const isActive = (href: string) => {
		const pathOnly = href.split("#")[0];
		return pathname === pathOnly;
	};

	return (
		<header className="sticky top-0 z-40 border-b border-surface-600 bg-surface-700/90 backdrop-blur">
			<div className="hidden border-b border-surface-600 bg-surface-700 px-4 py-2 text-xs text-ink-200/50 md:block">
				<div className="mx-auto flex max-w-6xl items-center justify-between">
					<div className="flex gap-4">
						<Link href="/news" className="hover:text-ink-100">
							Tin tức
						</Link>
						<Link href="/contact" className="hover:text-ink-100">
							Hỗ trợ
						</Link>
						<Link href="/" className="hover:text-ink-100">
							Hướng dẫn mua hàng
						</Link>
					</div>
				</div>
			</div>

			<div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 md:py-4">
				<Link href="/">
					<Image
						src="https://pub-f0a6dec73e084e83be3f5ea518ee5da7.r2.dev/logo.png"
						alt="Logo"
						width={32}
						height={32}
						priority
						onClick={() => setOpen(false)}
					/>
				</Link>

				<button
					type="button"
					className="ml-auto flex h-10 w-10 items-center justify-center rounded-full border border-surface-600 text-ink-100 md:hidden"
					onClick={() => setOpen((v) => !v)}
					aria-label="Mở menu">
					<CiMenuBurger />
				</button>

				<nav
					className={`${
						open ? "flex" : "hidden"
					} absolute left-0 right-0 top-full flex-col gap-2 rounded-b-2xl border border-surface-600 bg-surface-700 px-4 pb-5 pt-3 shadow-lg
     md:static md:flex md:flex-1 md:flex-row md:items-center md:justify-center md:gap-2
     md:border-none md:bg-transparent md:p-0 md:shadow-none`}
					aria-label="Điều hướng">
					{navLinks.map((link, idx) => {
						const active = isActive(link.href);
						return (
							<Link
								key={`${link.href}-${idx}`}
								href={link.href}
								className={`rounded-full px-3 py-2 text-sm font-semibold transition hover:bg-white/20 ${
									active
										? "bg-white/10 text-ink-50"
										: "text-ink-100/80"
								}`}
								onClick={() => setOpen(false)}>
								{link.label}
							</Link>
						);
					})}
					<div className="mt-2 flex flex-col gap-2 border-t border-surface-600 pt-3 md:hidden">
						<Link
							href="/checkout"
							onClick={() => setOpen(false)}
							className="flex items-center gap-2 rounded-full border border-surface-600 px-4 py-2 transition hover:border-ink-100">
							<IoIosCart />
							{cartCount >= 0 && (
								<span className="rounded-full bg-ink-100 px-2 py-1 text-xs font-bold text-[#0b0b0b]">
									{cartCount}
								</span>
							)}
						</Link>
						<Link
							href="/contact"
							onClick={() => setOpen(false)}
							className="rounded-full bg-ink-100 px-4 py-2 text-sm font-semibold text-[#0b0b0b] shadow-soft transition hover:bg-ink-50">
							Hỗ trợ
						</Link>
					</div>
				</nav>

				<div className="hidden items-center gap-3 md:flex">
					<Link
						href="/checkout"
						className="flex items-center gap-2 rounded-full border border-surface-600 px-4 py-2 transition hover:border-ink-100">
						<IoIosCart />
						{cartCount >= 0 && (
							<span className="rounded-full bg-ink-100 px-2 py-1 text-xs font-bold text-[#0b0b0b]">
								{cartCount}
							</span>
						)}
					</Link>
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
