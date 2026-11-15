"use client";

import { useState, type SubmitEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import type { Requirement } from "../../types/requirement";

type EditRequirementFormProps = {
    requirement: Requirement;
};

export default function EditRequirementForm({
    requirement,
}: EditRequirementFormProps) {

    // Form state
    const [title, setTitle] = useState(requirement.title);
    const [description, setDescription] = useState(requirement.description);
    const [priority, setPriority] = useState(requirement.priority);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();

    return (
        <form className="mt-8 max-w-2xl space-y-6" onSubmit={submitEditRequirement}>
            {/* Requirement Title */}
            <div>
                <label
                    htmlFor="title"
                    className="mb-2 block text-sm font-medium"
                >
                    Requirement Title
                </label>

                <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter requirement title..."
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
                    placeholder="Describe the requirement..."
                    rows={5}
                    className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 dark:border-stone-700 dark:bg-stone-900"
                    required
                />
            </div>

            {/* Priority */}
            <div>
                <label
                    htmlFor="priority"
                    className="mb-2 block text-sm font-medium"
                >
                    Priority
                </label>

                <select
                    id="priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 dark:border-stone-700 dark:bg-stone-900"
                >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>
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
                    href="/requirements"
                    className="rounded-md px-4 py-2 button-secondary"
                >
                    Cancel
                </Link>

                <button
                    type="submit"
                    className="button-primary rounded-md px-4 py-2"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Submitting..." : "Update Requirement"}
                </button>
            </div>
        </form>
    );

    async function submitEditRequirement(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        setIsSubmitting(true);
        setError(null);

        try {
            // Fetch statement
            const response = await fetch(`/api/requirements/${requirement.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title,
                    description,
                    priority,
                }),
            });

            // Check response.ok
            if (!response.ok) {
                throw new Error(`Failed to update requirement ${requirement.requirementId}.`);
            }

        // Navigate back after successful update
            router.push("/requirements");
        } catch {
            // Set an appropriate error message
            setError(`Failed to update requirement ${requirement.requirementId}.`);
        } finally {
            setIsSubmitting(false);
        }
    }
}