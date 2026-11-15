import CreateTestCaseForm from "./CreateTestCaseForm";

export default function CreateTestCasePage() {

    return (
        <div>
            <h1 className="text-2xl font-bold">
                Create Test Case
            </h1>

            <p className="mt-2 text-muted">
                Create a new system test case.
            </p>

            <CreateTestCaseForm />
        </div>
    );
}