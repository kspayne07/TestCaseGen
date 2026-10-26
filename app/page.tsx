import Link from "next/link";

export default function HomePage() {
    return (
        <div>
            <section className="mb-10">
                <h1 className="mb-4 text-4xl font-bold">
                    Welcome to Test Case Generator
                </h1>

                <p className="max-w-2xl text-lg text-muted">
                    Manage requirements, create test cases, and track
                    verification of your system.
                </p>
            </section>

            <section className="grid gap-6 md:grid-cols-2">
                <div className="border border-stone-200 rounded-lg bg-white p-6 shadow-sm dark:border-stone-700 dark:bg-stone-900">
                    <h2 className="mb-2 text-xl font-semibold">
                        Requirements
                    </h2>

                    <p className="mb-6 text-muted">
                        Create and manage system requirements.
                    </p>

                    <Link
                        href="/requirements"
                        className="inline-block rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 dark:bg-blue-800 dark:hover:bg-blue-700"
                    >
                        View Requirements
                    </Link>
                </div>

                <div className="border border-stone-200 rounded-lg bg-white p-6 shadow-sm dark:border-stone-700 dark:bg-stone-900">
                    <h2 className="mb-2 text-xl font-semibold">
                        Test Cases
                    </h2>

                    <p className="mb-6 text-muted">
                        Create and manage test cases and test steps.
                    </p>

                    <Link
                        href="/test-cases"
                        className="inline-block rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 dark:bg-blue-800 dark:hover:bg-blue-700"
                    >
                        View Test Cases
                    </Link>
                </div>
            </section>
        </div>
    );
} 
