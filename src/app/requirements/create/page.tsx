import CreateRequirementForm from "./CreateRequirementForm";

export default function CreateRequirementPage() {

    return (
        <div>
            <h1 className="text-2xl font-bold">
                Create Requirement
            </h1>

            <p className="mt-2 text-muted">
                Create a new system requirement.
            </p>

            <CreateRequirementForm />
        </div>
    );
}