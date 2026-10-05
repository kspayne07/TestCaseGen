import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { Prisma } from "@prisma/client";
import { z } from "zod";

// Zod schema for Test Case Data
const patchTestCaseSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    preconditions: z.string().optional(),
    passCriteria: z.string().optional(),
    status: z.enum(["Draft", "In Progress", "Complete"]).optional()
});

// Gets one test case by id
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

        return NextResponse.json(testCase, { status: 200 });
    } catch (error) {
        console.error(error);
        
        return NextResponse.json(
            { error: "Failed to fetch test case" },
            { status: 500 }
        );
    }
}

// Deletes a test case by id
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        const testCase = await prisma.testCase.delete({
            where: {
                id: Number(id)
            }
        });

        return NextResponse.json(testCase, { status: 200 });
    } catch (error) {
        console.error(error);

        // If test case with given id does not exist
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2025"
        ) {
            return NextResponse.json(
                { error: "Test case not found" },
                { status: 404 }
            );
        }
        
        return NextResponse.json(
            { error: "Failed to delete test case" },
            { status: 500 }
        );
    }
}

// Update a Test Case
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        const body = await request.json();

        const result = patchTestCaseSchema.safeParse(body);

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

        const testCaseData = result.data

        const testCase = await prisma.testCase.update({
            data: testCaseData,
            where: {
                id: Number(id)
            }
        });

        return NextResponse.json(testCase, { status: 200});
    } catch (error) {
        console.error(error);

        // If test case with given id does not exist
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2025"
        ) {
            return NextResponse.json(
                { error: "Test case not found" },
                { status: 404 }
            );
        }
        
        return NextResponse.json(
            { error: "Failed to update test case" },
            { status: 500 }
        );
    }
}
