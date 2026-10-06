import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { Prisma } from "@prisma/client";
import { z } from "zod";

// Zod schema for Test Step Data
const testStepSchema = z.object({
    testCaseId: z.int(),
    stepNumber: z.int(),
    instruction: z.string(),
    expectedResult: z.string().optional()
});

// Create a new Test Step
export async function POST(request: Request) {
    try {
        const body = await request.json();

        const result = testStepSchema.safeParse(body);

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

        const testStepData = result.data;

        const testStep = await prisma.testStep.create({
            data: testStepData,
        });

        return NextResponse.json(testStep, { status: 201});
    } catch (error) {
        console.error(error);

        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2003"
        ) {
            return NextResponse.json(
                { error: "Test case not found" },
                { status: 404 }
            );
        }
        
        return NextResponse.json(
            { error: "Failed to create test step" },
            { status: 500 }
        );
    }
}
