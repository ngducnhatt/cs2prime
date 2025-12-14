import { fetchServiceBySlug } from "@/lib/data";
import ServiceDisplay from "@/app/components/services/ServiceDisplay";
import { notFound } from "next/navigation";

export default async function VisaServicePage() {
	const service = await fetchServiceBySlug("visa");

	if (!service) {
		notFound();
	}

	return <ServiceDisplay service={service} />;
}
