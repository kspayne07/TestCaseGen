import { notFound } from "next/navigation";

import { getTestCaseById } from "@/src/lib/test-cases/getTestCaseById";

import TestCaseHeader from "./TestCaseHeader";
import TestCaseInformation from "./TestCaseInformation";
import TestCaseRequirements from "./TestCaseRequirements";
import TestCaseTestSteps from "./TestCaseSteps";

type TestCaseDetailsPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function TestCaseDetailsPage({
    params,
}: TestCaseDetailsPageProps) {

    // Fetch id from query params
    const { id } = await params;

    const testCaseId = Number(id);

    if (!Number.isInteger(testCaseId) || testCaseId <= 0) {
        notFound();
    }

    // Fetch the test case using data layer
    const testCase = await getTestCaseById(testCaseId);

    if (!testCase) {
        notFound();
    }

    return (
        <div className="flex flex-col gap-8">
            <TestCaseHeader testCase={testCase} />

            <TestCaseInformation testCase={testCase} />

            <TestCaseRequirements testCase={testCase} />

            <TestCaseTestSteps testCase={testCase} />
        </div>
    );
}
