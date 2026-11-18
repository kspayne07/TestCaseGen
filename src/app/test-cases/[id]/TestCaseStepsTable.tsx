
import type { TestCase } from "../types/testCase";

type TestCaseStepsTableProps = {
    testCase: TestCase;
};


export default function TestCaseStepsTable({ testCase 
    } : TestCaseStepsTableProps
) {
    return(
        <table className="border rounded w-full text-left text-sm">

            {/* Table Header */}
            <thead className="bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300">
                <tr>
                    <th className="px-4 py-3 font-semibold">#</th>
                    <th className="px-4 py-3 font-semibold">Step</th>
                    <th className="px-4 py-3 font-semibold">Expected Result</th>
                </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-stone-200 dark:divide-stone-700">
                {testCase.steps.map((ts) => (
                    <tr key={ts.stepNumber} className="hover:bg-stone-50 dark:hover:bg-stone-800/50">

                        <td className="px-4 py-4">
                            {ts.stepNumber}
                        </td>

                        <td className="px-4 py-4 text-stone-700 dark:text-stone-200">
                            {ts.instruction}
                        </td>

                        <td className="px-4 py-4 text-stone-600 dark:text-stone-300">
                            {ts.expectedResult ?? "No expected result provided"}
                        </td>

                    </tr>
                ))}
            </tbody>

        </table>
    );
}