import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { z } from "zod";

// Zod schema for Test Step Data
const testStepSchema = z.object({
    instruction: z.string().trim().min(1),
    expectedResult: z.string().trim().nullable().optional()
});

// Zod schema for Patch Test Step Data
const patchTestStepSchema = z.object({
    instruction: z.string().trim().min(1).optional(),
    expectedResult: z.string().trim().nullable().optional()
});

// Create a new Test Step
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const body = await request.json();

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

        const lastStep = await prisma.testStep.findFirst({
            where: {
                testCaseId: Number(id),
            },
            orderBy: {
                stepNumber: "desc",
            },
        });

        const nextStepNumber = (lastStep?.stepNumber ?? 0) + 1;

        const testStepData = result.data;

        const testStep = await prisma.testStep.create({
            data: {
                ...testStepData,
                stepNumber: nextStepNumber,
                testCaseId: testCase.id,
            }
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
