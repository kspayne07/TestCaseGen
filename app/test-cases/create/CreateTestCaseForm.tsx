"use client";

import { useState, useEffect, type SubmitEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import type { Requirement } from "../../requirements/types/requirement";

export default function CreateTestCaseForm() {

    // Form state
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [preconditions, setPreconditions] = useState("");
    const [passCriteria, setPassCriteria] = useState("");
    const [requirements, setRequirements] = useState<Requirement[]>([]);
    const [requirementIds, setRequirementIds] = useState<number[]>([]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    setIsLoading(false);
    const [error, setError] = useState<string | null>(null);

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
                setError("Unable to load requirements. Please try again.");
            }
            finally {
                setIsLoading(false);
            }
        }

        fetchRequirements();
    }, []);

    return (
        <form className="mt-8 max-w-2xl space-y-6" onSubmit={submitCreateTestCase}>
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
                    required
                />
            </div>

            {/* Preconditions */}
            <div>
                <label
                    htmlFor="preconditions"
                    className="mb-2 block text-sm font-medium"
                >
                    Preconditons
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
                    Passing Criteria
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
                                        cursor-pointer
                                        dark:border-stone-500
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
            </div>

            {/* Error Section */}
            {error && (
                <p className="text-sm text-red-600">
                    {error}
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
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Creating..." : "Create Test Case"}
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

    async function submitCreateTestCase(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        setIsSubmitting(true);
        setError(null);

        try {
            // Send POST request to create the Test Case
            const response = await fetch("/api/test-cases", {
                method: "POST",
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
                throw new Error("Failed to fetch test cases.");
            }

            // Navigate back after successful creation
            router.push("/test-cases");
        } catch {
            // Set an appropriate error message
            setError("Failed to create test case.");
        } finally {
            setIsSubmitting(false);
        }
    }
}
