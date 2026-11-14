"use client"

import { TestStep } from "../../test-steps/types/testStep";

import { useEffect, useState } from "react";

type TestCaseStepsTableProps = {
    testCaseId: number;
};


export default function TestCaseTestSteps({ testCaseId 
    } : TestCaseStepsTableProps
) {

    const [testSteps, setTestSteps] = useState<TestStep[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    /* Fetch test steps */
    useEffect(() => {
        async function fetchTestSteps() {
            try {
                const response = await fetch(`/api/test-cases/${testCaseId}/test-steps`);

                if (!response.ok) {
                    throw new Error("Failed to fetch test steps.");
                }

                const data = await response.json();

                setTestSteps(data);
            } catch {
                setError("Unable to load test steps. Please try again.");
            }
            finally {
                setIsLoading(false);
            }
        }

        fetchTestSteps();
    }, []);

    // Still waiting to fetch data
    if (isLoading) {
        return <p className="text-muted">Loading test steps...</p>;
    }

    // Error if fetch has an error
    if (error) {
        return <p className="text-red-600 dark:text-red-400">{error}</p>;
    }

    // Fetch resulted in no test steps
    if (testSteps.length === 0) {
        return <p className="text-muted">No test steps found.</p>;
    }

    return(
        <table className="border rounded w-full text-left text-sm">

            {/* Table Header */}
            <thead className="bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300">
                <tr>
                    <th className="px-4 py-3 font-semibold">#</th>
                    <th className="px-4 py-3 font-semibold">Step</th>
                    <th className="px-4 py-3 font-semibold">Expected Result</th>
                </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-stone-200 dark:divide-stone-700">
                {testSteps.map((ts) => (
                    <tr key={ts.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/50">

                        <td className="px-4 py-4">
                            {ts.stepNumber}
                        </td>

                        <td className="px-4 py-4 text-stone-700 dark:text-stone-200">
                            {ts.instruction}
                        </td>

                        <td className="px-4 py-4 text-stone-600 dark:text-stone-300">
                            {ts.expectedResult ?? "No expected result provided"}
                        </td>

                    </tr>
                ))}
            </tbody>

        </table>
    );
}