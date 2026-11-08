import Link from "next/link";
import { Plus } from "lucide-react";

import TestCasesList from "./TestCasesList";

export default function Page() {
    return(
        <div>
            <section>
                <div className="mb-6">
                    <h1 className="mb-4 text-4xl font-bold">
                        Test Cases
                    </h1>
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <p className="max-w-2xl text-lg text-muted">
                            Create, edit and manage all of your test cases.
                        </p>
                        <Link
                            href="/test-cases/create"
                            className="inline-flex items-center gap-2 button-primary rounded-md px-4 py-2"
                        >
                            <Plus size={18} />
                            New Test Case
                        </Link>
                    </div>
                </div>
            </section>

            <section>
                <TestCasesList />
            </section>
        </div>
    );
}