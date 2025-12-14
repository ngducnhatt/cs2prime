import { fetchServiceBySlug } from "@/lib/data";
import ServiceDisplay from "@/app/components/services/ServiceDisplay";
import { notFound } from "next/navigation";

export default async function CryptoServicePage() {
	const service = await fetchServiceBySlug("crypto");

	if (!service) {
		notFound();
	}

	return <ServiceDisplay service={service} />;
}
