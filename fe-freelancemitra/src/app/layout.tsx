import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Provider } from "@/components/ui/provider";
import AppLayout from "@/components/layout/app-layout";

// Load Poppins font
const poppins = Poppins({
    variable: "--font-poppins",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"], // You can adjust this based on your needs
    display: "swap",
});

export const metadata: Metadata = {
    title: "Freelance Mitra",
    description: "Your freelance marketplace",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={poppins.variable}>
                <Provider>
                    <AppLayout>{children}</AppLayout>
                </Provider>
            </body>
        </html>
    );
}
