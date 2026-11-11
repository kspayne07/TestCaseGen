"use client";

import { useState, useEffect, type SubmitEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import type { Requirement } from "../../../requirements/types/requirement";
import type { TestCase } from "../../types/testCase";

type EditTestCaseFormProps = {
    testCase: TestCase;
};

export default function EditTestCaseForm({
    testCase,
}: EditTestCaseFormProps) {

    // Form state
    const [title, setTitle] = useState(testCase.title);
    const [description, setDescription] = useState(testCase.description ?? "");
    const [preconditions, setPreconditions] = useState(testCase.preconditions ?? "");
    const [passCriteria, setPassCriteria] = useState(testCase.passCriteria ?? "");
    const [requirements, setRequirements] = useState<Requirement[]>([]);
    const [requirementIds, setRequirementIds] = useState<number[]>([...testCase.requirements.map((req) => req.requirement.id)]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [requirementsError, setRequirementsError] = useState<string | null>(null);

    const router = useRouter();

    useEffect(() => {
            async function fetchRequirements() {
                try {
                    const response = await fetch("/api/requirements");
    
                    if (!response.ok) {
                        throw new Error("Failed to fetch requirements.");
                    }
    
                    const data = await response.json();
    
                    setRequirements(data);
                } catch {
                    setRequirementsError("Unable to load Requirements. Please try again.");
                }
                finally {
                    setIsLoading(false);
                }
            }
    
            fetchRequirements();
        }, []);

    return (
        <form className="mt-8 max-w-2xl space-y-6" onSubmit={submitEditTestCase}>
            {/* Title */}
            <div>
                <label
                    htmlFor="title"
                    className="mb-2 block text-sm font-medium"
                >
                    Test Case Title
                </label>

                <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter test case title..."
                    className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 dark:border-stone-700 dark:bg-stone-900"
                    required
                />
            </div>

            {/* Description */}
            <div>
                <label
                    htmlFor="description"
                    className="mb-2 block text-sm font-medium"
                >
                    Description
                </label>

                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the test case..."
                    rows={5}
                    className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 dark:border-stone-700 dark:bg-stone-900"
                />
            </div>

            {/* Preconditions */}
            <div>
                <label
                    htmlFor="preconditions"
                    className="mb-2 block text-sm font-medium"
                >
                    Preconditions
                </label>

                <textarea
                    id="preconditions"
                    value={preconditions}
                    onChange={(e) => setPreconditions(e.target.value)}
                    placeholder="List the test case's preconditions..."
                    rows={5}
                    className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 dark:border-stone-700 dark:bg-stone-900"
                />
            </div>

            {/* Pass Criteria */}
            <div>
                <label
                    htmlFor="passCriteria"
                    className="mb-2 block text-sm font-medium"
                >
                    Pass Criteria
                </label>

                <textarea
                    id="passCriteria"
                    value={passCriteria}
                    onChange={(e) => setPassCriteria(e.target.value)}
                    placeholder="Describe the test case's passing criteria..."
                    rows={5}
                    className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 dark:border-stone-700 dark:bg-stone-900"
                />
            </div>

            {/* Associated Requirements */}
            <div className="space-y-3">
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Associated Requirements
                    </label>
                    <p className="text-sm text-stone-500 mb-3">
                        Select the Requirements this Test Case covers.
                    </p>
                </div>
                {isLoading ? (<p className="text-muted">Loading requirements...</p>) :
                (
                    <div className="space-y-2 rounded-md border border-stone-300 dark:border-stone-700 p-3">
                    {requirements.length === 0 ? (
                        <p className="text-sm text-stone-500">
                            No Requirements available.
                        </p>
                    ) : (
                        requirements.map((req) => (
                            <label
                                key={req.id}
                                className="flex items-start gap-3 rounded-md p-2 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                            >
                                <input
                                    type="checkbox"
                                    name="requirements"
                                    value={req.id}
                                    checked={requirementIds.includes(req.id)}
                                    onChange={(e) =>
                                        handleRequirementChange(req.id, e.target.checked)
                                    }
                                    className="
                                        mt-1 size-5 shrink-0 appearance-none rounded-full
                                        border-2 border-stone-400
                                        checked:border-blue-600 checked:bg-blue-600
                                        checked:dark:border-blue-400 dark:checked:bg-blue-400
                                        cursor-pointer
                                        dark:border-stone-500
                                        focus-visible:outline-2
                                        focus-visible:outline-offset-2
                                        focus-visible:outline-blue-600
                                    "
                                />

                                <div>
                                    <p className="text-sm font-medium">
                                        {req.requirementId} — {req.title}
                                    </p>
                                    <p className="text-xs text-stone-500">
                                        {req.description}
                                    </p>
                                </div>
                            </label>
                        ))
                    )}
                </div>
                )}
            </div>

            {/* Error Section */}
            {error && (
                <p className="text-sm text-red-600">
                    {error}
                </p>
            )}

            {requirementsError && (
                <p className="text-sm text-red-600">
                    {requirementsError}
                </p>
            )}

             {/* Button Section */}
            <div className="flex justify-end gap-3">
                <Link
                    href="/test-cases"
                    className="rounded-md border border-stone-300 px-4 py-2 font-medium text-gray-700 hover:bg-stone-100 dark:border-stone-700 dark:text-gray-300 dark:hover:bg-stone-800"
                >
                    Cancel
                </Link>

                <button
                    type="submit"
                    className="button-primary rounded-md px-4 py-2"
                    disabled={isSubmitting || isLoading || requirementsError !== null}
                >
                    {isSubmitting ? "Updating..." : "Update Test Case"}
                </button>
            </div>
        </form>
    );

    function handleRequirementChange(id: number, checked: boolean) {
        setRequirementIds((currentIds) =>
            checked
                ? [...currentIds, id]
                : currentIds.filter((currentId) => currentId !== id)
        );
    }

    async function submitEditTestCase(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        setIsSubmitting(true);
        setError(null);

        try {
            // Send update request
            const response = await fetch(`/api/test-cases/${testCase.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title,
                    description,
                    preconditions,
                    passCriteria,
                    requirementIds
                }),
            });

            // Check response.ok
            if (!response.ok) {
                throw new Error(`Failed to update test case ${testCase.testCaseId}.`);
            }

            // Navigate back after successful update
            router.push("/test-cases");
        } catch {
            // Set an appropriate error message
            setError(`Failed to update test case ${testCase.testCaseId}.`);
        } finally {
            setIsSubmitting(false);
        }
    }
}