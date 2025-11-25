import type { Metadata } from "next";
import servicesData from "@/data/services.json";

type Service = { id: string; title: string; description: string; cta: string };

const data = servicesData as { services: Service[] };

export const metadata: Metadata = {
	title: "Dịch vụ",
};

const ServicesPage = () => {
	return (
		<div className="space-y-6">
			<header className="rounded-2xl border border-surface-600 bg-surface-700 p-6 shadow-soft">
				<p className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-50">
					Dịch vụ
				</p>
				<h1 className="mt-2 text-2xl font-bold text-ink-50">
					Dịch vụ tiện ích
				</h1>
				<p className="text-sm text-ink-100/80">
					Nạp thẻ, tư vấn giftcard, cài đặt từ xa và hỗ trợ bảo mật
					tài khoản.
				</p>
			</header>

			<div className="grid gap-4 md:grid-cols-3">
				{data.services.map((service) => (
					<div
						key={service.id}
						id={service.id}
						className="rounded-xl border border-surface-600 bg-surface-700 p-5 shadow-soft transition hover:-translate-y-1 hover:border-ink-50/40">
						<h2 className="text-lg font-semibold text-ink-50">
							{service.title}
						</h2>
						<p className="mt-2 text-sm text-ink-100/80">
							{service.description}
						</p>
						<button
							type="button"
							className="mt-4 rounded-lg border border-ink-700 px-4 py-2 text-sm font-semibold text-ink-50 hover:-translate-y-0.5 hover:border-ink-50">
							{service.cta}
						</button>
					</div>
				))}
			</div>
		</div>
	);
};

export default ServicesPage;
