"use client";

import { useEffect, useState } from "react";
import { FaLongArrowAltUp } from "react-icons/fa";

const ScrollTopButton = () => {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const onScroll = () => setVisible(window.scrollY > 200);
		onScroll();
		window.addEventListener("scroll", onScroll);
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	if (!visible) return null;

	return (
		<button
			type="button"
			aria-label="Cuộn lên đầu trang"
			className="fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-ink-100 text-lg font-bold text-ink-900 shadow-soft transition hover:-translate-y-1 hover:bg-ink-50"
			onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
			<FaLongArrowAltUp />
		</button>
	);
};

export default ScrollTopButton;
