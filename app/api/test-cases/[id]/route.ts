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
    status: z.enum(["Draft", "In Progress", "Complete"]).optional(),
    requirementIds: z.array(z.number().int().positive()).optional(),
});

// Gets one test case by id
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        const testCase = await prisma.testCase.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                steps: {
                    orderBy: {
                        stepNumber: "asc",
                    },
                },
                requirements: {
                    include: {
                        requirement: true,
                    }
                }
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

        // Check that the id is a number
        const testCaseId = Number(id);

        if (!Number.isInteger(testCaseId) || testCaseId <= 0) {
            return NextResponse.json(
                { error: "Invalid Test Case ID" },
                { status: 400 }
            );
        }

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

        // Only validate Requirement IDs if they were provided
        if (testCaseData.requirementIds !== undefined) {

            // Check that all selected Requirements exist
            const existingRequirements = await prisma.requirement.findMany({
                where: {
                    id: {
                        in: testCaseData.requirementIds,
                    },
                },
                select: {
                    id: true,
                },
            });

            // Find IDs that weren't returned by the database
            const existingIds = new Set(
                existingRequirements.map((requirement) => requirement.id)
            );

            const invalidIds = testCaseData.requirementIds.filter(
                (id) => !existingIds.has(id)
            );

            // Return an error if any Requirement IDs are invalid
            if (invalidIds.length > 0) {
                return NextResponse.json(
                    {
                        error: "One or more Requirements could not be found.",
                        invalidRequirementIds: invalidIds,
                    },
                    { status: 400 }
                );
            }
        }

        const { requirementIds, ...testCaseFields } = testCaseData;

        const testCase = await prisma.testCase.update({
            data: {
                ...testCaseFields,

                ...(requirementIds !== undefined && {
                    requirements: {
                        deleteMany: {},
                        create: requirementIds.map((requirementId) => ({
                            requirement: {
                                connect: { id: requirementId },
                            },
                        })),
                    },
                }),
            },
            where: {
                id: Number(id),
            },
            include: {
                requirements: {
                    include: {
                        requirement: true,
                    },
                },
            },
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
