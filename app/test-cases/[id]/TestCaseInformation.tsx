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


            { /* Preconditions and Pass Criteria */ }
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                    <h3 className="font-semibold mb-2">
                        Preconditions
                    </h3>
                    <p>
                        {testCase.preconditions || "No preconditions specified."}
                    </p>
                </div>
                <div className="border-t border-stone-200 pt-6 dark:border-stone-700 sm:border-l sm:border-t-0 sm:pt-0 sm:pl-6">
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
