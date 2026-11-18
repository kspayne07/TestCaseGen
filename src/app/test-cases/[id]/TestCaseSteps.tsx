"use client";

import { useEffect, useState } from "react";

import type { TestCase } from "../types/testCase";
import type { TestStep } from "../../test-steps/types/testStep";

import TestCaseStepsTable from "./TestCaseStepsTable";
import TestStepModal from "./test-steps/TestStepModal";

import { List, Plus } from "lucide-react"

import { useRouter } from "next/navigation";

type TestCaseStepsProps = {
    testCase: TestCase;
};

type TestStepFormData = {
    instruction: string;
    expectedResult: string | null;
};

export default function TestCaseSteps({ testCase 
    } : TestCaseStepsProps
) {
    const router = useRouter();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStep, setSelectedStep] = useState<TestStep | null>(null);
    const [modalMode, setModalMode] = useState<"Add" | "Edit">("Add");

    function handleAdd() {
        setSelectedStep(null);
        setModalMode("Add");
        setIsModalOpen(true);
    }

    function handleEdit(step: TestStep) {
        setSelectedStep(step);
        setModalMode("Edit");
        setIsModalOpen(true);
    }
    
    function handleClose() {
        setIsModalOpen(false);
        setSelectedStep(null);
    }

    async function handleSave(formData: TestStepFormData) {
        let response: Response;

        // Create a new Test Step
        if (modalMode === "Add") {

            // Send create request
            response = await fetch(`/api/test-cases/${testCase.id}/test-steps/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
        }
        else {
            //Check if the selected test step exists
            if (!selectedStep) {
                throw new Error("No valid Test Step selected for editing.");
            }

            // Send update request
            response = await fetch(`/api/test-cases/${testCase.id}/test-steps/${selectedStep.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
        }

        // Check response.ok
        if (!response.ok) {
            throw new Error(`Failed to update test step ${selectedStep?.id}.`);
        }
            
        router.refresh();
        handleClose();
    }

    return(
        <div className="border border-stone-200 rounded-lg bg-white p-6 shadow-sm dark:border-stone-700 dark:bg-stone-900">

            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                { /* Heading and Icon */ }
                <h2 className="flex items-center gap-4 text-2xl font-semibold">
                    <List size={28} className="text-blue-600 dark:text-blue-400" />
                    Test Steps
                </h2>

                {/* New Test Step button */}
                <button
                    className="inline-flex items-center gap-2 button-primary rounded-md px-4 py-2"
                    onClick={() => handleAdd()}
                >
                    <Plus size={18} />
                    New Test Step
                </button>
            </div>

            <TestCaseStepsTable testCase={testCase} />

            <TestStepModal
                isOpen={isModalOpen}
                mode={modalMode}
                testStep={selectedStep}
                onClose={handleClose}
                onSave={handleSave}
            />

        </div>
    );
}