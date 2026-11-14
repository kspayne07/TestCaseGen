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

    // 1. Get the ID from the URL
    const { id } = await params;

    // 2. Fetch the test case using your API
    const response = await fetch(
        `http://localhost:3000/api/test-cases/${id}`
    );

    // 3. Check whether the request succeeded
    if (!response.ok) {
        throw new Error("Failed to fetch test case.");
    }

    // 4. Convert the response into a JavaScript object
    const testCase = await response.json();

    return (
        <div className="flex flex-col gap-8">
            <TestCaseHeader testCase={testCase} />

            <TestCaseInformation testCase={testCase} />

            <TestCaseRequirements testCase={testCase} />

            <TestCaseTestSteps testCase={testCase} />
        </div>
    );
}