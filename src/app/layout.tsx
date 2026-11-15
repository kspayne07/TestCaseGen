import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
    title: "Test Case Generator",
    description: "Requirements and test case management tool",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="min-h-screen bg-stone-100 text-gray-900 dark:bg-stone-950 dark:text-gray-100">
                <nav className="border-b border-gray-200 bg-white dark:border-stone-700 dark:bg-stone-900">
                    <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                        <Link
                            href="/"
                            className="text-xl font-bold"
                        >
                            Test Case Generator
                        </Link>

                        <div className="flex gap-6">
                            <Link
                                href="/requirements"
                                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                            >
                                Requirements
                            </Link>

                            <Link
                                href="/test-cases"
                                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                            >
                                Test Cases
                            </Link>
                        </div>
                    </div>
                </nav>

                <main className="mx-auto max-w-6xl px-6 py-10">
                    {children}
                </main>
            </body>
        </html>
    );
}