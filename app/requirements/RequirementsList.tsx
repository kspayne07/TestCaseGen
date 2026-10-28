"use client";

import { useEffect, useState } from "react";

import type { Requirement } from "./types/requirement";
import { Trash2 } from "lucide-react";

export default function RequirementsList() {
    const [requirements, setRequirements] = useState<Requirement[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    // Still waiting to fetch data
    if (isLoading) {
        return <p className="text-muted">Loading requirements...</p>;
    }

    // Error if fetch has an error
    if (error) {
        return <p className="text-red-600 dark:text-red-400">{error}</p>;
    }

    // Fetch resulted in no requirements
    if (requirements.length === 0) {
        return <p className="text-muted">No requirements found.</p>;
    }

    return (
        <ul className="bg-white p-2 border border-stone-200 rounded-lg dark:border-stone-700 dark:bg-stone-900">
            {requirements.map((req) => (
                <li 
                    key={req.id}
                    className="border-b border-stone-200 dark:border-stone-700 last:border-b-0"
                >
                <div className="flex items-start justify-between gap-2 p-4">
                    {/* Requirement title, priority badge, and description */}
                    <div className="min-w-0 flex-1">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                            <h2 className="text-base font-semibold">
                                {req.requirementId} -- {req.title}
                            </h2>
                            <span className={`rounded-full px-3 text-sm ${getPriorityClasses(req.priority)}`}
                            >
                                {req.priority ?? "Unassigned"}
                            </span>
                        </div>
                        <p className="max-w-2xl text-sm text-muted">
                            {req.description}
                        </p>
                    </div>
                    <button 
                        className="shrink-0 p-1 border rounded-lg text-muted hover-text-danger" 
                        aria-label="Delete requirement {req.requirementId}"
                        onClick={() => handleDeleteClick(req)}>
                            <Trash2 size={18} />
                    </button>
                </div>
            </li>
            ))}
        </ul>
    )

    async function handleDeleteClick(req: Requirement) {
        const confirmed = window.confirm(
            `Are you sure you want to delete ${req.requirementId}?`
        );

        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(`/api/requirements/${req.id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete requirement.");
            }

            // Update requirements state
            setRequirements((currentRequirements) =>
                currentRequirements.filter(
                    (requirement) => requirement.id !== req.id
                )
            );
        } catch {
            alert("Unable to delete requirement. Please try again.");
        }
    }
}

function getPriorityClasses(priority: string | null) {
    switch (priority) {
        case "High":
            return "border bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
        case "Medium":
            return "border bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";
        case "Low":
            return "border bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
        default:
            return "border bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    }
}
