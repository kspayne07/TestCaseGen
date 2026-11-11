"use client";

import { useEffect, useState } from "react";

import type { TestCase } from "./types/testCase";
import { Trash2, Pencil } from "lucide-react";

import Link from "next/link";

export default function TestCasesList() {
    const [testCases, setTestCases] = useState<TestCase[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    useEffect(() => {
        async function fetchTestCases() {
            try {
                const response = await fetch("/api/test-cases");

                if (!response.ok) {
                    throw new Error("Failed to fetch test cases.");
                }

                const data = await response.json();

                setTestCases(data);
            } catch {
                setError("Unable to load test cases. Please try again.");
            }
            finally {
                setIsLoading(false);
            }
        }

        fetchTestCases();
    }, []);

    async function handleDeleteClick(tc: TestCase) {
        const confirmed = window.confirm(
            `Are you sure you want to delete ${tc.testCaseId}?`
        );

        if (!confirmed) {
            return;
        }

        // Prevents multiple deletion requests for the same requirement
        setDeletingId(tc.id);

        try {
            const response = await fetch(`/api/test-cases/${tc.id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete test case.");
            }

            // Update requirements state
            setTestCases((currentTestCases) =>
                currentTestCases.filter(
                    (testCase) => testCase.id !== tc.id
                )
            );
        } catch {
            alert("Unable to delete test case. Please try again.");
        } finally {
            // enables the delete button
            setDeletingId(null);
        }
    }

    // Still waiting to fetch data
    if (isLoading) {
        return <p className="text-muted">Loading test cases...</p>;
    }

    // Error if fetch has an error
    if (error) {
        return <p className="text-red-600 dark:text-red-400">{error}</p>;
    }

    // Fetch resulted in no test cases
    if (testCases.length === 0) {
        return <p className="text-muted">No test cases found.</p>;
    }

    return (
        <div className="max-h-[600px] overflow-y-auto rounded-lg border border-stone-200 dark:border-stone-700">
            <ul className="bg-white p-2 dark:bg-stone-900">
                {testCases.map((tc) => (
                    <li 
                        key={tc.id}
                        className="border-b border-stone-200 dark:border-stone-700 last:border-b-0"
                    >
                    <div className="flex items-start justify-between gap-2 p-4">
                        <div className="min-w-0 flex-1">
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                                {/* Test Case title*/}
                                <h2 className="text-base font-semibold">
                                    {tc.testCaseId} -- {tc.title}
                                </h2>

                                {/* Test Case status*/}
                                <span className={`rounded-full px-3 text-sm ${getStatusClasses(tc.status)}`}
                                >
                                    {tc.status ?? "Unassigned"}
                                </span>
                            </div>
                            {/* Test Case description*/}
                            <p className="max-w-2xl text-sm text-muted">
                                {tc.description}
                            </p>

                            {/* Associated Requirements */}
                            <div className="mt-3 space-y-2">

                                <p className="text-xs font-medium text-stone-500 dark:text-stone-400">
                                    ASSOCIATED REQUIREMENTS
                                </p>

                                {tc.requirements.length === 0 ? (
                                    <p className="text-sm text-stone-500 dark:text-stone-400">
                                        No associated Requirements.
                                    </p>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {tc.requirements.map((association) => (
                                            <span
                                                key={association.requirement.id}
                                                className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                                            >
                                                {association.requirement.requirementId}
                                                {" — "}
                                                {association.requirement.title}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        {/* Edit button*/}
                        <Link
                            href={`/test-cases/${tc.id}/edit`}
                            className="shrink-0 p-1 border rounded-lg text-muted hover-text-primary" 
                            aria-label={`Edit test case ${tc.testCaseId}`}>
                                <Pencil size={16} />
                        </Link>
                        
                        {/* Delete button*/}
                        <button 
                            className="shrink-0 p-1 border rounded-lg text-muted hover-text-danger disabled:cursor-not-allowed disabled:opacity-50" 
                            aria-label={`Delete test case ${tc.testCaseId}`}
                            disabled={deletingId === tc.id}
                            onClick={() => handleDeleteClick(tc)}>
                                <Trash2 size={18} />
                        </button>
                    </div>
                </li>
                ))}
            </ul>
        </div>
    )
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
