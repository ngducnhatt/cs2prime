"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

type CartItem = {
	id: string;
	name: string;
	price: string;
	image?: string;
	badge?: string;
	status?: string;
	description?: string;
	category?: string;
	categoryId?: string;
	note?: string;
	quantity: number;
};

type CartContextValue = {
	items: CartItem[];
	addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
	removeFromCart: (id: string) => void;
	updateQuantity: (id: string, quantity: number) => void;
	clearCart: () => void;
	totalValue: number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

const parsePrice = (price: string | number) => {
	if (typeof price === "number") return price;
	if (!price) return 0;
	const numericString = price.replace(/[^\d.]/g, "");
	const value = parseFloat(numericString);
	return Number.isFinite(value) ? value : 0;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
	const [items, setItems] = useState<CartItem[]>([]);
	const [isLoaded, setIsLoaded] = useState(false);

	// Load dữ liệu từ localStorage khi mount
	useEffect(() => {
		const stored = localStorage.getItem("CS2Prime.store_cart");
		if (stored) {
			try {
				// eslint-disable-next-line react-hooks/set-state-in-effect
				setItems(JSON.parse(stored));
			} catch {
				setItems([]);
			}
		}
		setIsLoaded(true);
	}, []);

	// Lưu vào localStorage khi items thay đổi
	useEffect(() => {
		if (isLoaded) {
			localStorage.setItem("CS2Prime.store_cart", JSON.stringify(items));
		}
	}, [items, isLoaded]);

	const addToCart = (item: Omit<CartItem, "quantity">, quantity = 1) => {
		setItems((prev) => {
			const existing = prev.find((p) => p.id === item.id);
			if (existing) {
				return prev.map((p) =>
					p.id === item.id
						? { ...p, quantity: p.quantity + Math.max(1, quantity) }
						: p,
				);
			}
			return [...prev, { ...item, quantity: Math.max(1, quantity) }];
		});
	};

	const removeFromCart = (id: string) => {
		setItems((prev) => prev.filter((item) => item.id !== id));
	};

	const updateQuantity = (id: string, quantity: number) => {
		setItems((prev) =>
			prev.map((item) =>
				item.id === id
					? { ...item, quantity: Math.max(1, quantity) }
					: item,
			),
		);
	};

	const clearCart = () => setItems([]);

	const totalValue = useMemo(
		() =>
			items.reduce(
				(sum, item) => sum + parsePrice(item.price) * item.quantity,
				0,
			),
		[items],
	);

	return (
		<CartContext.Provider
			value={{
				items,
				addToCart,
				removeFromCart,
				updateQuantity,
				clearCart,
				totalValue,
			}}>
			{children}
		</CartContext.Provider>
	);
};

export const useCart = () => {
	const ctx = useContext(CartContext);
	if (!ctx) {
		throw new Error("useCart must be used within CartProvider");
	}
	return ctx;
};
