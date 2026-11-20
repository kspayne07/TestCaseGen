"use client";

import { useState, useEffect } from "react";
import type { TestStep } from "@/app/test-steps/types/testStep";

export type TestStepFormData = {
    instruction: string;
    expectedResult: string | null;
};

type TestStepFormProps = {
    testStep: TestStep | null;
    onClose: () => void;
    onSave: (data: TestStepFormData) => Promise<void>;
};

export default function TestStepForm({
    testStep,
    onClose,
    onSave,
}: TestStepFormProps) {
    const [instruction, setInstruction] = useState(
        testStep?.instruction ?? ""
    );

    const [expectedResult, setExpectedResult] = useState(
        testStep?.expectedResult ?? ""
    );

    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /* Update fields when testStep is updated */
    useEffect(() => {
        setInstruction(testStep?.instruction ?? "");
        setExpectedResult(testStep?.expectedResult ?? "");
    }, [testStep]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setIsSaving(true);
        setError(null);

        try {
            await onSave({
                instruction: instruction.trim(),
                expectedResult: expectedResult.trim() || null,
            });
        } catch {
            setError("Failed to save Test Step. Please try again.");
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Instruction */}
            <div className="flex flex-col gap-1">
                <label htmlFor="instruction">
                    Instruction
                </label>

                <textarea
                    id="instruction"
                    value={instruction}
                    onChange={(e) => setInstruction(e.target.value)}
                    required
                    rows={3}
                    placeholder="Enter the test instruction..."
                    className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 dark:border-stone-700 dark:bg-stone-900"
                />
            </div>

            {/* Expected Result */}
            <div className="flex flex-col gap-1">
                <label htmlFor="expectedResult">
                    Expected Result
                </label>

                <textarea
                    id="expectedResult"
                    value={expectedResult}
                    onChange={(e) => setExpectedResult(e.target.value)}
                    rows={3}
                    placeholder="Enter the expected result..."
                    className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 dark:border-stone-700 dark:bg-stone-900"
                />
            </div>

            {/* Error Message */}
            {error && (
                <p className="text-sm text-red-600">
                    {error}
                </p>
            )}

            {/* Buttons */}
            <div className="flex justify-end gap-2">
                <button
                    type="button"
                    onClick={onClose}
                    disabled={isSaving}
                    className="button-secondary rounded-lg px-4 py-2"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={isSaving || !instruction.trim()}
                    className="button-primary rounded-lg px-4 py-2"
                >
                    {isSaving ? "Saving..." : "Save"}
                </button>
            </div>
        </form>
    );
}
