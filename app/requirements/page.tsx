import RequirementsList from "./RequirementsList";

export default function Page() {
    return(
        <div>
            <section>
                <div className="mb-6">
                    <h1 className="mb-4 text-4xl font-bold">
                        Requirements
                    </h1>

                    <p className="max-w-2xl text-lg text-muted">
                        Create, edit and manage all of your requirements.
                    </p>
                </div>
            </section>

            <section>
                <RequirementsList />
            </section>
        </div>
    );
}
