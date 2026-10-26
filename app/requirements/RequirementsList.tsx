"use client";

import { useEffect, useState } from "react";
import type { Requirement } from "./types/requirement";

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


    if (isLoading) {
        return <p className="text-muted">Loading requirements...</p>;
    }

        if (error) {
        return <p className="text-red-600 dark:text-red-400">{error}</p>;
    }
    return (
        <ul className="bg-white p-2 border border-stone-200 rounded-lg dark:border-stone-700 dark:bg-stone-900">
            {requirements.map((req) => (
                <li 
                    key={req.id}
                    className="border-b border-stone-200 dark:border-stone-700 last:border-b-0"
                >
                <div className="p-4">
                    <div className="flex flex-wrap items-center mb-2 gap-2">
                        <h2 className="text-base font-semibold">
                            {req.requirementId} -- {req.title}
                        </h2>
                        <span className={`rounded-full px-3 text-sm ${getPriorityClasses(req.priority)}`}
                        >
                            {req.priority}
                        </span>
                    </div>
                    <p className="max-w-2xl text-sm text-muted">
                        {req.description}
                    </p>
                </div>
            </li>
            ))}
        </ul>
    )
}

function getPriorityClasses(priority: string | null) {
    switch (priority) {
        case "High":
            return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
        case "Medium":
            return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
        case "Low":
            return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
        default:
            return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
}
