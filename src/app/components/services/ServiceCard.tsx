"use client";

import Link from "next/link";
import { Service } from "@/lib/types";

type ServiceCardProps = {
	service: Service;
};

export const ServiceCard = ({ service }: ServiceCardProps) => {
	return (
		<div
			key={service.id}
			id={service.id}
			className="rounded-xl border border-surface-600 bg-surface-700 p-5 shadow-soft hover:border-ink-50/40">
			<h2 className="text-lg font-semibold text-ink-50">
				{service.title}
			</h2>
			<p className="mt-2 text-sm text-ink-100/80">
				{service.description}
			</p>

			<Link
				href={service.status === false ? "#" : `/services/${service.id}`}
				className={`mt-4 inline-block rounded-lg border border-ink-700 px-4 py-2 text-sm font-semibold text-ink-50 ${
					service.status === false
						? "cursor-not-allowed opacity-50"
						: "hover:bg-ink-700"
				}`}
				onClick={(e) => {
					if (service.status === false) {
						e.preventDefault();
					}
				}}
			>
				{service.status === false ? "Tạm hết" : "Liên hệ"}
			</Link>
		</div>
	);
};
