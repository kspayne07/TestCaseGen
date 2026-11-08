"use client";

import { useEffect, useState } from "react";

import type { TestCase } from "./types/testCase";
import { Trash2 } from "lucide-react";
import { Pencil } from "lucide-react";

import Link from "next/link";

export default function TestCasesList() {
    const [testCases, setTestCases] = useState<TestCase[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    useEffect(() => {
        async function fetchTestCases() {
            try {
                const response = await fetch("/api/test-case");

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
            const response = await fetch(`/api/requirements/${tc.id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete requirement.");
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
        <ul className="bg-white p-2 border border-stone-200 rounded-lg dark:border-stone-700 dark:bg-stone-900">
            {testCases.map((tc) => (
                <li 
                    key={tc.id}
                    className="border-b border-stone-200 dark:border-stone-700 last:border-b-0"
                >
                <div className="flex items-start justify-between gap-2 p-4">
                    {/* Test Case title and description */}
                    <div className="min-w-0 flex-1">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                            <h2 className="text-base font-semibold">
                                {tc.testCaseId} -- {tc.title}
                            </h2>
                        </div>
                        <p className="max-w-2xl text-sm text-muted">
                            {tc.description}
                        </p>
                    </div>
                    <Link
                        href={`/test-cases/${tc.id}/edit`}
                        className="shrink-0 p-1 border rounded-lg text-muted hover-text-primary" 
                        aria-label={`Edit test case ${tc.testCaseId}`}>
                            <Pencil size={16} />
                    </Link>
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
    )
}


