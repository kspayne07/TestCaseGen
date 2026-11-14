import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { Prisma } from "@prisma/client";
import { z } from "zod";

// Zod schema for Test Step Data
const patchTestStepSchema = z.object({
    instruction: z.string().optional(),
    expectedResult: z.string().optional()
});


// Gets one test step by id
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        const testStep = await prisma.testStep.findUnique({
            where: {
                id: Number(id)
            }
        });

        if (!testStep) {
            return NextResponse.json(
                { error: "Test step not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(testStep, { status: 200 });
    } catch (error) {
        console.error(error);
        
        return NextResponse.json(
            { error: "Failed to fetch test step" },
            { status: 500 }
        );
    }
}

// Deletes a test step by id
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        const testStep = await prisma.testStep.delete({
            where: {
                id: Number(id)
            }
        });

        return NextResponse.json(testStep, { status: 200 });
    } catch (error) {
        console.error(error);

        // If test step with given id does not exist
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2025"
        ) {
            return NextResponse.json(
                { error: "Test step not found" },
                { status: 404 }
            );
        }
        
        return NextResponse.json(
            { error: "Failed to delete test step" },
            { status: 500 }
        );
    }
}

// Update a Test Step
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        const body = await request.json();

        const result = patchTestStepSchema.safeParse(body);

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

        const testStepData = result.data

        const testStep = await prisma.testStep.update({
            data: testStepData,
            where: {
                id: Number(id)
            }
        });

        return NextResponse.json(testStep, { status: 200});
    } catch (error) {
        console.error(error);

        // If test step with given id does not exist
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2025"
        ) {
            return NextResponse.json(
                { error: "Test step not found" },
                { status: 404 }
            );
        }
        
        return NextResponse.json(
            { error: "Failed to update test step" },
            { status: 500 }
        );
    }
}
