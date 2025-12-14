import Link from "next/link";

const Footer = () => {
	return (
		<footer className="mt-12 border-t border-surface-600 bg-surface-700/90 py-8">
			<div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 md:flex-row md:justify-between">
				<div>
					<p className="text-lg font-semibold">CS2Prime.store</p>
					<p className="mt-2 max-w-md text-sm text-ink-200/50">
						Nền tảng mua bán key Steam, giftcard Steam, code Steam
						Wallet; dịch vụ game và tài khoản game, value game.
						Thanh toán nhanh, nhận hàng trong vài giây.
					</p>
				</div>
				<div className="grid grid-cols-2 gap-6 text-sm text-ink-100 md:grid-cols-3">
					<div className="space-y-2">
						<p className="font-semibold text-ink-50">Liên kết</p>
						<Link
							href="/products"
							className="block text-ink-200/50 hover:text-ink-200/80">
							Sản phẩm
						</Link>
						<Link
							href="/services"
							className="block text-ink-200/50 hover:text-ink-200/80">
							Dịch vụ
						</Link>
						<Link
							href="/news"
							className="block text-ink-200/50 hover:text-ink-200/80">
							Tin tức
						</Link>
					</div>
					<div className="space-y-2">
						<p className="font-semibold text-ink-50">Hỗ trợ</p>
						<Link
							href="/contact"
							className="block text-ink-200/50 hover:text-ink-200/80">
							Liên hệ
						</Link>
						<a
							href="mailto:support@cs2prime.store"
							className="block text-ink-200/50 hover:text-ink-200/80">
							support@cs2prime.store
						</a>
					</div>
					<div className="space-y-2">
						<p className="font-semibold text-ink-50">Thanh toán</p>
						<p className="text-ink-200/50 ">
							VISA / Momo / Ngân hàng
						</p>
					</div>
				</div>
			</div>
			<p className="mt-8 text-center text-xs text-ink-100/60">
				© 2025 CS2Prime.store | All rights reserved.
			</p>
		</footer>
	);
};

export default Footer;
