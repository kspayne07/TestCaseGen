import type { TestCase } from "../types/testCase";

import { Info } from "lucide-react"

type TestCaseInformationProps = {
    testCase: TestCase;
};

export default function TestCaseInformation({ testCase 
    } : TestCaseInformationProps
) {

    return(
        <div className="border border-stone-200 rounded-lg bg-white p-6 shadow-sm dark:border-stone-700 dark:bg-stone-900">

            { /* Heading and Icon */ }
            <h2 className="mb-4 flex items-center gap-4 text-2xl font-semibold">
                <Info size={28} className="text-blue-600 dark:text-blue-400" />
                Test Information
            </h2>


            { /* Preconditons and Pass Criteria */ }
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <h3 className="font-semibold mb-2">
                        Preconditions
                    </h3>
                    <p>
                        {testCase.preconditions || "No preconditions specified."}
                    </p>
                </div>
                <div className="border-l border-stone-200 dark:border-stone-700 pl-6">
                    <h3 className="font-semibold mb-2">
                        Pass Criteria
                    </h3>
                    <p>
                        {testCase.passCriteria || "No pass criteria specified."}
                    </p>
                </div>
            </div>
        </div>
    );
}
