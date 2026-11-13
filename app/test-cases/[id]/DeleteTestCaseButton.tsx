
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

type DeleteTestCaseButtonProps = {
    id: number;
    testCaseId: string;
};

export default function DeleteTestCaseButton({
    id,
    testCaseId,
}: DeleteTestCaseButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();

    async function handleDelete() {
        const confirmed = window.confirm(
            `Are you sure you want to delete Test Case ${testCaseId}?`
        );

        if (!confirmed) return;

        setIsDeleting(true);
        setError(null);

        try {
            const response = await fetch(`/api/test-cases/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete Test Case.");
            }

            router.push("/test-cases");
            router.refresh();
        } catch {
            setError("Unable to delete Test Case. Please try again.");
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <div>
            <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="button-danger inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 transition-colors"
            >
                <Trash2 size={18} />
                {isDeleting ? "Deleting..." : "Delete"}
            </button>

            {error && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {error}
                </p>
            )}
        </div>
    );
}
