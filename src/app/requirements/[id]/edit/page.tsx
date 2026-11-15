import EditRequirementForm from "./EditRequirementForm";

import type { Requirement } from "../../types/requirement";

type EditRequirementPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function EditRequirementPage({
    params,
}: EditRequirementPageProps) {

    // 1. Get the ID from the URL
    const { id } = await params;

    // 2. Fetch the requirement using your API
    const response = await fetch(
        `http://localhost:3000/api/requirements/${id}`
    );

    // 3. Check whether the request succeeded
    if (!response.ok) {
        throw new Error("Failed to fetch requirement.");
    }

    // 4. Convert the response into a JavaScript object
    const requirement = await response.json();

    return (
        <div>
            <h1 className="text-2xl font-bold">
                Create Requirement
            </h1>

            <p className="mt-2 text-muted">
                Create a new system requirement.
            </p>

            <EditRequirementForm requirement={requirement}/>
        </div>
    );
}