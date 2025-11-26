export type Category = {
	id: string;
	name: string;
	href?: string;
	sold?: number;
	count?: number;
	image?: string;
	description?: string[];
};

export type ProductVariant = {
	id: string;
	label: string;
	price?: number;
	sold?: number;
	tag?: string;
	save?: string;
	status?: boolean;
	bonus?: string;
};

export type ProductSource = {
	title: string;
	guarantee?: string;
	image?: string;
	notes?: string[];
	variants?: ProductVariant[];
	description?: ProductSection[];
	related?: RelatedProduct[];
};

export type ProductSection = { title: string; body: string[] };

export type RelatedProduct = { title: string; image?: string };

export type Service = { id: string; title: string; description: string; status?: boolean };

export type Post = { id: string; title: string; content: string; excerpt?: string; date: string };

export type ProductListItem = {
	id: string;
	categoryId: string;
	title: string;
	price?: number;
	sold?: number;
	tag?: string;
	save?: string;
	status?: boolean;
	image?: string;
};
