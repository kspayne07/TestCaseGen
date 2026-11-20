"use client"

import { useState } from "react"

import type { TestCase } from "../types/testCase";
import type { TestStep } from "../../test-steps/types/testStep"

import { Pencil, Trash2 } from "lucide-react";

type TestCaseStepsTableProps = {
    testCase: TestCase;
    onEdit: (step: TestStep) => void;
    onDelete: (step: TestStep) => Promise<void>;
};

export default function TestCaseStepsTable({ testCase, onEdit, onDelete
    } : TestCaseStepsTableProps
) {
    const [deletingId, setDeletingId] = useState<number | null>(null);

    async function handleDeleteClick(ts: TestStep) {

        // Prevents multiple deletion requests for the same step
        setDeletingId(ts.id);

        try {
            await onDelete(ts);
        } catch {
            alert("Unable to delete test step. Please try again.");
        } finally {
            // enables the delete button
            setDeletingId(null);
        }
    }

    return(
        <table className="border rounded w-full text-left text-sm">

            {/* Table Header */}
            <thead className="bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300">
                <tr>
                    <th className="px-4 py-3 font-semibold">#</th>
                    <th className="px-4 py-3 font-semibold">Step</th>
                    <th className="px-4 py-3 font-semibold">Expected Result</th>
                    <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-stone-200 dark:divide-stone-700">
                {testCase.steps.map((ts) => (
                    <tr key={ts.stepNumber} className="hover:bg-stone-50 dark:hover:bg-stone-800/50">

                        <td className="px-4 py-4">
                            {ts.stepNumber}
                        </td>

                        <td className="px-4 py-4 text-stone-700 dark:text-stone-200">
                            {ts.instruction}
                        </td>

                        <td className="px-4 py-4 text-stone-600 dark:text-stone-300">
                            {ts.expectedResult ?? "No expected result provided"}
                        </td>

                        <td className="px-4 py-4 text-stone-600 dark:text-stone-300 space-x-2">

                            {/* Edit button*/}
                            <button
                                className="shrink-0 p-1 border rounded-md text-muted hover-text-primary" 
                                onClick={() => onEdit(ts)}
                                aria-label={`Edit step ${ts.stepNumber}`}>
                                    <Pencil size={18} />
                            </button>

                            {/* Delete button*/}
                            <button 
                                className="shrink-0 p-1 border rounded-md text-muted hover-text-danger disabled:cursor-not-allowed disabled:opacity-50" 
                                aria-label={`Delete test step ${ts.stepNumber}`}
                                disabled={deletingId === ts.id}
                                onClick={() => handleDeleteClick(ts)}>
                                    <Trash2 size={18} />
                            </button>
                        </td>

                    </tr>
                ))}
            </tbody>

        </table>
    );
}