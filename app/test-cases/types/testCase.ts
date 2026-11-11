export type TestCase = {
    id: number;
    testCaseId: string;
    title: string;
    description: string | null;
    preconditions: string | null;
    passCriteria: string | null;
    status: string;
    
    requirements: {
        requirement: {
            id: number;
            requirementId: string;
            title: string;
        };
    }[];
};