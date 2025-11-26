import type { Metadata } from "next";
import ContactContent from "./ContactContent";

export const metadata: Metadata = {
	title: "Liên hệ",
};

const ContactPage = () => {
	return <ContactContent />;
};

export default ContactPage;
