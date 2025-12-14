import type { Metadata } from "next";
import { fetchServices } from "@/lib/data";
import { ServiceCard } from "@/app/components/services/ServiceCard";

export const metadata: Metadata = {
	title: "Dịch vụ",
};

export const revalidate = 0;

const ServicesPage = async () => {
	const data = await fetchServices();

	return (
		<div className="space-y-6">
			<header className="mt-10 rounded-3xl border border-surface-600 bg-surface-700 p-6 shadow-soft">
				<h1 className="text-2xl font-bold text-ink-50">
					Dịch vụ tiện ích
				</h1>
				<p className="text-sm text-ink-100/80">
					Crypto, Nạp thẻ, tư vấn giftcard, cài đặt từ xa và hỗ trợ
					bảo mật tài khoản.
				</p>
			</header>

			<div className="grid gap-4 md:grid-cols-3">
				{data.map((service) => (
					<ServiceCard key={service.id} service={service} />
				))}
			</div>
		</div>
	);
};

export default ServicesPage;
