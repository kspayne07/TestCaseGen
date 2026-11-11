import EditTestCaseForm from "./EditTestCaseForm";

import type { TestCase } from "../../types/testCase";

type EditTestCasePageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function EditRequirementPage({
    params,
}: EditTestCasePageProps) {

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
        <div>
            <h1 className="text-2xl font-bold">
                Create Requirement
            </h1>

            <p className="mt-2 text-muted">
                Create a new system requirement.
            </p>

            <EditTestCaseForm testCase={testCase}/>
        </div>
    );
}