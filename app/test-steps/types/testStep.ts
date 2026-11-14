export type TestStep = {
    id: number;
    testCaseId: number;
    stepNumber: number;
    instruction: string;
    expectedResult: string | null;
};