"use client";

import Image from "next/image";
import { useState } from "react";

const CONTACT_EMAIL = "support@cs2prime.store";

const ContactContent = () => {
	const [copied, setCopied] = useState(false);

	const handleCopyEmail = async () => {
		try {
			await navigator.clipboard.writeText(CONTACT_EMAIL);
			setCopied(true);
		} catch {
			setCopied(false);
		} finally {
			setTimeout(() => setCopied(false), 1500);
		}
	};

	return (
		<div className="mt-10 space-y-6">
			<div className="grid gap-5 lg:grid-cols-5 rounded-2xl border border-surface-600 bg-surface-700 p-6 shadow-soft">
				<aside className="lg:col-span-2 flex flex-col justify-between rounded-2xl bg-ink-950 p-4 text-ink-50">
					<div className="space-y-3">
						<div className="relative h-40 w-full overflow-hidden rounded-xl">
							<Image
								src="https://pub-f0a6dec73e084e83be3f5ea518ee5da7.r2.dev/logo.png"
								alt="Banner"
								fill
								sizes="320px"
								className="object-contain p-4"
							/>
							<div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface-900/60 to-transparent" />
						</div>
						<h2 className="text-lg font-bold">
							Liên hệ dịch vụ hỗ trợ khách hàng
						</h2>
						<p className="text-sm text-ink-100/80">
							Chúng tôi hỗ trợ 24/7. Bạn có thể chat trực tiếp
							hoặc gửi email để nhận phản hồi nhanh nhất từ đội
							ngũ chăm sóc khách hàng của{" "}
							<span>CS2Prime.store</span>.
						</p>
					</div>
				</aside>

				<section className="lg:col-span-3 space-y-6">
					<div className="rounded-2xl bg-ink-950 p-5">
						<h3 className="text-lg font-normal text-ink-50">
							Liên hệ với chúng tôi qua
						</h3>

						<div className="mt-4 grid gap-2 md:grid-cols-3">
							<button className="flex items-center gap-2 card px-3 py-2 text-left text-sm font-semibold text-ink-50">
								<a href="https://www.facebook.com/profile.php?id=61579789322561">
									Facebook
								</a>
							</button>
							<button className="flex items-center gap-2 card px-3 py-2 text-left text-sm font-semibold text-ink-50">
								<span>Telegram</span>
							</button>
							<button className="flex items-center gap-2 card px-3 py-2 text-left text-sm font-semibold text-ink-50">
								<span>Discord</span>
							</button>
						</div>
					</div>

					<div className="rounded-2xl bg-ink-950 p-5 space-y-3">
						<h3 className="text-lg font-normal text-ink-50">
							Hãy email cho chúng tôi
						</h3>
						<div>
							<div className="mt-2 flex flex-wrap gap-2">
								<button
									onClick={handleCopyEmail}
									className="rounded-full bg-surface-700 px-3 py-1 text-sm font-medium text-ink-50 transition hover:border-ink-100 hover:bg-surface-600"
									title="Copy email">
									{copied ? "Đã copy!" : CONTACT_EMAIL}
								</button>
							</div>
						</div>
					</div>

					<div className="rounded-2xl bg-ink-950 p-5 space-y-3">
						<h3 className="text-lg font-normal text-ink-50">
							Địa chỉ CS2Prime.store
						</h3>
						<div className="overflow-hidden rounded-xl border border-surface-600">
							<div className="h-64 w-full bg-surface-700">
								<iframe
									title="CS2Prime.store Map"
									src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3725.223922260935!2d105.78884687544814!3d20.983659280654454!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135accf2e89d531%3A0x79a6a4e049e4116d!2zc-G7kSAxMCDEkC4gVHLhuqduIFBow7osIFAuIE3hu5kgTGFvLCBIw6AgxJDDtG5nLCBIw6AgTuG7mWksIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1763948067283!5m2!1svi!2s"
									className="h-full w-full"
									loading="lazy"
								/>
							</div>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
};

export default ContactContent;
