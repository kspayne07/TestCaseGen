import type { TestCase } from "../types/testCase";

import DeleteTestCaseButton from "./DeleteTestCaseButton";

import Link from "next/link";
import { ArrowLeft, Pencil, ClipboardList } from "lucide-react"

type TestCaseHeaderProps = {
    testCase: TestCase;
};

export default async function TestCaseHeader({ testCase 
    } : TestCaseHeaderProps
) {

    return(
        <div className="border border-stone-200 rounded-lg bg-white p-6 shadow-sm dark:border-stone-700 dark:bg-stone-900">
            <div className="flex items-start justify-between gap-2 p-4">
                <div className="flex min-w-0 flex-1 items-start gap-4">

                    {/* Clipboard Icon */}
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-600/40 dark:text-blue-300">
                        <ClipboardList size={32} />
                    </div>

                    {/* Test Case Information */}
                    <div className="min-w-0 flex-1">
                        {/* Title Section */}
                        <h2 className="mb-2 text-3xl font-semibold">
                            {testCase.testCaseId} -- {testCase.title}
                        </h2>

                        {/* Test Case status*/}
                        <span className={`inline-flex items-center rounded-full px-3 text-sm ${getStatusClasses(testCase.status)}`}
                        >
                            {testCase.status ?? "Unassigned"}
                        </span>

                        {/* Description */}
                        <p className="mt-2 text-muted">
                            {testCase.description}
                        </p>
                    </div>
                </div>

                {/* Button Section */}
                <div className="flex justify-end gap-3">

                    {/* Back to Test Case List */}
                    <Link
                        href="/test-cases"
                        className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-md border border-stone-300 px-4 py-2 font-medium text-gray-700 hover:bg-stone-100 dark:border-stone-700 dark:text-gray-300 dark:hover:bg-stone-800"
                    >
                        <ArrowLeft size={16} />
                        Back to List
                    </Link>

                    {/* Edit */}
                    <Link
                        href={`/test-cases/${testCase.id}/edit`}
                        className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-md button-primary px-4 py-2"
                    >
                        <Pencil size={16} />
                        Edit
                    </Link>

                    {/* Delete */}
                    <DeleteTestCaseButton id={testCase.id} testCaseId={testCase.testCaseId}/>

                </div>
            </div>
        </div>
    );
}

function getStatusClasses(priority: string | null) {
    switch (priority) {
        case "Draft":
            return "border bg-stone-100 text-stone-800 dark:bg-stone-600 dark:text-stone-200";
        case "Ready":
            return "border bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200";
        case "Retired":
            return "border bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200";
        default:
            return "border bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    }
}