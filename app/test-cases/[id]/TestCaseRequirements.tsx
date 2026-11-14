import type { TestCase } from "../types/testCase";

import { Link } from "lucide-react"

type TestCaseRequirementsProps = {
    testCase: TestCase;
};

export default function TestCaseRequirements({ testCase 
    } : TestCaseRequirementsProps
) {

    const associatedRequirements = testCase.requirements;

    return(

        <div className="border border-stone-200 rounded-lg bg-white p-6 shadow-sm dark:border-stone-700 dark:bg-stone-900">

            { /* Heading and Icon */ }
            <h2 className="mb-4 flex items-center gap-4 text-2xl font-semibold">
                <Link size={28} className="text-blue-600 dark:text-blue-400" />
                Associated Requirements
            </h2>

            { /* Requirement Badges */}
            <div className="flex flex-wrap gap-2">
                {associatedRequirements.map((req) => (
                    <span key={req.requirement.id} className="border border-blue-300/50 inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/70">
                        {req.requirement.requirementId} — {req.requirement.title}
                    </span>
                ))}
            </div>
        </div>

    );
}