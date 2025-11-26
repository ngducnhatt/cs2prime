import { revalidateTag } from "next/cache";

const secret = process.env.REVALIDATE_SECRET;

const parseTags = (value: unknown): string[] => {
	if (Array.isArray(value)) {
		return value.map(String).map((tag) => tag.trim()).filter(Boolean);
	}
	if (typeof value === "string") {
		return value
			.split(",")
			.map((tag) => tag.trim())
			.filter(Boolean);
	}
	return [];
};

export async function POST(req: Request) {
	const { searchParams } = new URL(req.url);
	const token = searchParams.get("secret");

	if (!secret || token !== secret) {
		return Response.json({ message: "Invalid secret" }, { status: 401 });
	}

	let body: any = null;
	try {
		body = await req.json();
	} catch {
		// ignore invalid JSON; we'll fall back to query params
	}

	const tags = parseTags(body?.tags ?? body?.tag);
	const queryTags = parseTags(searchParams.get("tag"));
	if (queryTags.length) tags.push(...queryTags);

	if (!tags.length) {
		return Response.json({ message: "Missing tag" }, { status: 400 });
	}

	// Pass a cache profile (required in Next 16) to satisfy the signature.
	tags.forEach((tag) => revalidateTag(tag, { expire: 0 }));

	return Response.json({ revalidated: true, tags });
}
