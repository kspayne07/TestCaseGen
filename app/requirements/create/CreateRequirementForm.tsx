"use client";

import { useState, type SubmitEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateRequirementForm() {

    // Form state
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("Medium");

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();

    return (
        <form className="mt-8 max-w-2xl space-y-6" onSubmit={submitCreateRequirement}>
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
                    className="rounded-md border border-stone-300 px-4 py-2 font-medium text-gray-700 hover:bg-stone-100 dark:border-stone-700 dark:text-gray-300 dark:hover:bg-stone-800"
                >
                    Cancel
                </Link>

                <button
                    type="submit"
                    className="button-primary rounded-md px-4 py-2"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Creating..." : "Create Requirement"}
                </button>
            </div>
        </form>
    );

    async function submitCreateRequirement(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        setIsSubmitting(true);
        setError(null);

        try {
            // Fetch statement
            const response = await fetch("/api/requirements", {
                method: "POST",
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
                throw new Error("Failed to fetch requirements.");
            }

            // Navigate back after successful creation
            router.push("/requirements");
        } catch {
            // Set an appropriate error message
            setError("Failed to create requirement.");
        } finally {
            setIsSubmitting(false);
        }
    }
}
