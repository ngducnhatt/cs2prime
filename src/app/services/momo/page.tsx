import { fetchServiceBySlug } from "@/lib/data";
import ServiceDisplay from "@/app/components/services/ServiceDisplay";
import { notFound } from "next/navigation";

export default async function MomoServicePage() {
	const service = await fetchServiceBySlug("momo");

	if (!service) {
		notFound();
	}

	return <ServiceDisplay service={service} />;
}
