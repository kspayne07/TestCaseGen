import type { TestCase } from "../types/testCase";

import TestCaseStepsTable from "./TestCaseStepsTable";

import { List } from "lucide-react"

type TestCaseStepsProps = {
    testCase: TestCase;
};

export default async function TestCaseTestSteps({ testCase 
    } : TestCaseStepsProps
) {

    return(
        <div className="border border-stone-200 rounded-lg bg-white p-6 shadow-sm dark:border-stone-700 dark:bg-stone-900">

            { /* Heading and Icon */ }
            <h2 className="mb-4 flex items-center gap-4 text-2xl font-semibold">
                <List size={28} className="text-blue-600 dark:text-blue-400" />
                Test Steps
            </h2>

            <TestCaseStepsTable testCaseId={testCase.id} />

        </div>
    );
}