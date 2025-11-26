import type { Metadata } from "next";
import { fetchPosts } from "@/lib/data";

export const metadata: Metadata = {
	title: "Tin tức",
};

const BlogPage = async () => {
	const posts = await fetchPosts();

	return (
		<div className="space-y-6">
			<header className="rounded-2xl border border-surface-600 bg-surface-700 p-6 shadow-soft">
				<h1 className="mt-2 text-2xl font-bold text-ink-50">Tin tức</h1>
				<p className="text-sm text-ink-100/80">
					Tổng hợp kinh nghiệm mua key, bảo mật tài khoản và khuyến mãi mới nhất.
				</p>
			</header>

			<div className="grid gap-4 md:grid-cols-3">
				{posts.map((post) => (
					<article
						key={post.id}
						className="rounded-xl border border-surface-600 bg-surface-700 p-4 shadow-soft transition hover:border-ink-50/40">
						<p className="text-xs uppercase tracking-wide text-ink-100/70">
							{new Date(post.date).toLocaleDateString("vi-VN")}
						</p>
						<h2 className="mt-2 text-lg font-semibold text-ink-50">
							{post.title}
						</h2>
						<p className="text-sm text-ink-100/80">
							{post.excerpt || post.content}
						</p>
						<button
							type="button"
							className="mt-4 rounded-lg border border-white/15 px-3 py-2 text-sm font-semibold text-ink-50 hover:border-ink-500">
							Đọc tiếp
						</button>
					</article>
				))}
			</div>
		</div>
	);
};

export default BlogPage;
