import Image from "next/image";
import ReactMarkdown from "react-markdown";
import type { Service } from "@/lib/types";

interface ServiceDisplayProps {
	service: Service;
}

const ServiceDisplay = ({ service }: ServiceDisplayProps) => {
	return (
		<div className="p-4 md:p-8">
			<article className="prose prose-invert lg:prose-xl mx-auto bg-crust p-6 md:p-10 rounded-xl shadow-soft">
				<h1>{service.title}</h1>
				{/* {service.image && (
					<div className="relative h-60 w-full overflow-hidden rounded-lg my-6">
						<Image
							src={service.image}
							alt={service.title}
							fill
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
							className="object-cover"
						/>
					</div>
				)} */}
				<ReactMarkdown>{service.description}</ReactMarkdown>
			</article>
		</div>
	);
};

export default ServiceDisplay;
