import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

// Gets all test steps for a test case
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        const testCase = await prisma.testCase.findUnique({
            where: {
                id: Number(id)
            }
        });

        if (!testCase) {
            return NextResponse.json(
                { error: "Test case not found" },
                { status: 404 }
            );
        }

        const testSteps = await prisma.testStep.findMany({
            where: {
                testCaseId: Number(id)
            }
        });

        return NextResponse.json(testSteps, { status: 200 });
    } catch (error) {
        console.error(error);
        
        return NextResponse.json(
            { error: "Failed to fetch test steps" },
            { status: 500 }
        );
    }
}
