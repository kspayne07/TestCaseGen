import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { z } from "zod";

// Zod schema for Test Case Data
const testCaseSchema = z.object({
    testCaseId: z.string(),
    title: z.string(),
    description: z.string().optional(),
    preconditions: z.string().optional(),
    passCriteria: z.string().optional()
});

// Create a new Test Case
export async function POST(request: Request) {
    try {
        const body = await request.json();

        const result = testCaseSchema.safeParse(body);

        // Zod validation 
        if (!result.success) {
            return NextResponse.json({
                error: "Invalid request",
                details: result.error.issues,
            },
            {
                status: 400
            });
        }

        const testCaseData = result.data;

        const testCase = await prisma.testCase.create({
            data: testCaseData,
        });

        return NextResponse.json(testCase, { status: 201});
    } catch (error) {
        console.error(error);
        
        return NextResponse.json(
            { error: "Failed to create test case" },
            { status: 500 }
        );
    }
}


// Gets all Test Cases
export async function GET(request: Request) {
    try {
        const testCases = await prisma.testCase.findMany();

        return NextResponse.json(testCases, { status: 200});
    } catch (error) {
        console.error(error);
        
        return NextResponse.json(
            { error: "Failed to fetch test cases" },
            { status: 500 }
        );
    }
}
