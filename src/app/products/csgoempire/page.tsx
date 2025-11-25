"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";

import { useCart } from "@/app/context/CartContext";
import detailSource from "@/data/products/empire.json";

type Variant = {
	id: string;
	label: string;
	price: number;
	bonus?: string;
	tag?: string;
	save?: string;
};

type Section = { title: string; body: string[] };
type Related = { title: string; region: string; image: string };

type Detail = {
	hero: {
		title: string;
		region: string;
		guarantee: string;
		image: string;
		notes: string[];
	};
	variants: Variant[];
	description: Section[];
	related: Related[];
};

const formatPrice = (value: number) =>
	value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const placeholderImg = "/assets/placeholder-card.svg";

const normalizeDetail = (data: any): Detail => ({
	hero: {
		title: data.title,
		region: data.region,
		guarantee: data.guarantee,
		image: data.image,
		notes: data.notes || [],
	},
	variants: data.variants || [],
	description: data.description || [],
	related: data.related || [],
});

const detail = normalizeDetail(detailSource as any);
const categoryId = "csgoempire";
const isSimpleLayout = false;

const CsgoEmpirePage = () => {
	const { addToCart } = useCart();

	const [quantity, setQuantity] = useState(1);
	const [selected, setSelected] = useState(detail.variants[0]?.id ?? "");
	const [customerInfo, setCustomerInfo] = useState("");

	const selectedItem = useMemo(
		() =>
			detail.variants.find((v) => v.id === selected) ??
			detail.variants[0],
		[selected],
	);
	const total = (selectedItem?.price || 0) * quantity;

	const renderHero = () => (
		<div className="overflow-hidden rounded-2xl border border-surface-600 bg-surface-700 shadow-soft">
			<div className="relative h-44 w-full md:h-52">
				<Image
					src={detail.hero.image || placeholderImg}
					alt={detail.hero.title}
					fill
					className="object-cover"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-surface-700 via-surface-700/80 to-transparent" />
				<div className="absolute inset-x-4 bottom-4 flex flex-col gap-2 md:flex-row md:items-center md:gap-6">
					<div className="flex items-center gap-4">
						<div className="relative h-[84px] w-16 overflow-hidden rounded-xl bg-surface-600">
							<Image
								src={detail.hero.image || placeholderImg}
								alt="logo"
								fill
								className="object-cover"
							/>
						</div>
						<div>
							<h1 className="text-xl font-bold text-ink-50">
								{detail.hero.title}
							</h1>
							<div className="mt-1 flex flex-wrap gap-3 text-xs text-ink-100/80">
								<span className="inline-flex items-center gap-1 rounded-full bg-ink-800 px-2 py-1">
									Khu vuc {detail.hero.region}
								</span>
								<span className="inline-flex items-center gap-1 rounded-full bg-ink-800 px-2 py-1">
									{detail.hero.guarantee}
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);

	const renderVariants = () => (
		<div className="rounded-2xl border border-surface-600 bg-surface-700 p-4 shadow-soft">
			<h3 className="text-sm font-semibold text-ink-50">Chon san pham</h3>
			<div className="mt-3 grid gap-3 md:grid-cols-2">
				{detail.variants.map((variant) => {
					const active = variant.id === selectedItem?.id;
					return (
						<button
							key={variant.id}
							onClick={() => setSelected(variant.id)}
							className={`flex flex-col rounded-2xl border px-4 py-3 text-left transition ${
								active
									? "border-surface-700 bg-primary-700/30 text-ink-50"
									: "border-surface-600 bg-surface-700 text-ink-50 hover:border-primary-700"
							}`}>
							<div className="flex items-center justify-between">
								<p className="text-sm font-normal">
									{variant.label}
								</p>
								{variant.save && (
									<span className="rounded-full bg-success-500/20 px-2 py-0.5 text-xs font-semibold text-success-400">
										{variant.save}
									</span>
								)}
							</div>
							<div className="mt-2 flex items-center justify-between text-xs text-ink-100/80">
								<span>{variant.bonus}</span>
								<span className="text-base font-normal text-ink-100">
									{formatPrice(variant.price)}
								</span>
							</div>
						</button>
					);
				})}
			</div>
		</div>
	);

	const renderCustomerInfo = () => (
		<div className="rounded-2xl border border-surface-600 bg-surface-700 p-4 shadow-soft">
			<h3 className="text-sm font-semibold text-ink-50">
				Thong tin nhan hang
			</h3>
			<p className="mt-1 text-xs text-ink-200/80">
				Nhap tai khoan/email hoac ghi chu de xu ly don hang nhanh hon.
			</p>
			<textarea
				value={customerInfo}
				onChange={(e) => setCustomerInfo(e.target.value)}
				placeholder="Vi du: tai khoan, server, ghi chu khac..."
				className="mt-3 w-full rounded-xl border border-surface-600 bg-ink-900 px-3 py-2 text-sm text-ink-50 placeholder:text-ink-200/50 focus:border-primary-700 focus:outline-none"
				rows={3}
			/>
		</div>
	);

	const renderDescription = () => (
		<div className="space-y-3 rounded-2xl border border-surface-600 bg-surface-700 p-5 shadow-soft">
			<h3 className="text-sm font-normal text-ink-50">Mo ta</h3>
			{detail.description.map((section) => (
				<div key={section.title} className="space-y-2">
					<p className="text-base font-semibold text-ink-50">
						{section.title}
					</p>
					<ul className="list-disc space-y-1 pl-5 text-sm text-ink-100/80">
						{section.body.map((line) => (
							<li key={line}>{line}</li>
						))}
					</ul>
				</div>
			))}
		</div>
	);

	const renderSummary = () => (
		<aside className="space-y-4">
			<div className="rounded-2xl border border-surface-600 bg-surface-700 p-4 shadow-soft">
				<div className="flex items-center justify-between">
					<p className="text-sm font-normal text-ink-50">So luong</p>
					<div className="flex items-center gap-2">
						<button
							onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
							<CiCircleMinus />
						</button>
						<span className="min-w-[24px] text-center text-sm text-ink-50">
							{quantity}
						</span>
						<button onClick={() => setQuantity((q) => q + 1)}>
							<CiCirclePlus />
						</button>
					</div>
				</div>
				<div className="mt-3 rounded-xl border border-surface-600 bg-ink-950 p-3">
					<p className="text-sm font-semibold text-ink-50">Tam tinh</p>
					<p className="text-2xl font-normal text-ink-50">
						{formatPrice(total)}
					</p>

					<div className="mt-3 flex flex-col gap-2">
						<button
							className="w-full rounded-3xl bg-info-400 px-4 py-2 text-sm font-medium text-ink-50"
							onClick={() => {
								if (selectedItem) {
									addToCart(
										{
											id: `${categoryId}-${selectedItem.id}`,
											name: `${detail.hero.title} - ${selectedItem.label}`,
											price: formatPrice(selectedItem.price),
											image: detail.hero.image,
											categoryId,
											note: customerInfo || undefined,
										},
										quantity,
									);
								}
							}}>
							Them vao gio hang
						</button>
					</div>
				</div>
			</div>
		</aside>
	);

	return (
		<div className="space-y-6">
			{renderHero()}
			<div className="grid gap-5 lg:grid-cols-[1.7fr,0.9fr]">
				<div className="space-y-4">
					{renderVariants()}
					{renderCustomerInfo()}
					{renderDescription()}
				</div>
				{renderSummary()}
			</div>
		</div>
	);
};

export default CsgoEmpirePage;
