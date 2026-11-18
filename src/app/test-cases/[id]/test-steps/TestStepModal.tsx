"use client";

import { useEffect, useRef } from "react";

import { X } from 'lucide-react'

import type { TestStep } from "../../../test-steps/types/testStep";
import TestStepForm from "./TestStepForm";

export type TestStepFormData = {
    instruction: string;
    expectedResult: string | null;
};

type TestStepModalProps = {
    isOpen: boolean;
    mode: "Add" | "Edit";
    testStep: TestStep | null;
    onClose: () => void;
    onSave: (data: TestStepFormData) => Promise<void>;
};

export default function TestStepModal({ isOpen, mode, testStep, onClose, onSave }: TestStepModalProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (isOpen) {
            dialog.showModal();
        } else {
            dialog.close();
        }
    }, [isOpen]);

    return (
        <dialog
            ref={dialogRef}
            onClose={onClose}
            onClick={(e) => {
                if (e.target === dialogRef.current) onClose();
            }}
            className="m-auto w-full max-w-lg rounded-xl border border-stone-200 bg-white p-6 text-stone-900 shadow-xl backdrop:bg-black/50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
        >
            <div className="flex items-center justify-between border-b border-stone-200 pb-3 dark:border-stone-700">

                <h2 className="text-lg font-semibold">
                    {`${mode} Test Step`}
                </h2>

                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close modal"
                    className="text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200"
                >
                    <X size={18} />
                </button>
            </div>

            <div className="mt-4">
                <TestStepForm
                    testStep={testStep}
                    onClose={onClose}
                    onSave={onSave}
                />
            </div>
        </dialog>
    );
}