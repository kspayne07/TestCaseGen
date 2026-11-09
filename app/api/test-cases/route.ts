import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { z } from "zod";


// Zod schema for Test Case Data
const testCaseSchema = z.object({
    title: z.string().trim().min(1),
    description: z.string().trim().min(1, "Description is required"),
    preconditions: z.string().optional(),
    passCriteria: z.string().optional(),
    requirementIds: z.array(z.number().int().positive())
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

        /* Requests squence variable value from prisma */
        const sequenceResult = await prisma.$queryRaw<{ nextval: bigint }[]>`
            SELECT nextval('test_case_id_seq')
        `;

        const testCaseId = `TC-${sequenceResult[0].nextval.toString().padStart(3, "0")}`;

        const { requirementIds, ...testCaseFields } = testCaseData;

        const testCase = await prisma.testCase.create({
            data: {
                testCaseId,
                ...testCaseFields,
                requirements: {
                    create: requirementIds.map((requirementId) => ({
                        requirement: {
                            connect: { id: requirementId },
                        },
                    })),
                },
            },
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
        const testCases = await prisma.testCase.findMany({
            include: {
                requirements: {
                    include: {
                        requirement: true,
                    }
                }
            }
        });

        return NextResponse.json(testCases, { status: 200});
    } catch (error) {
        console.error(error);
        
        return NextResponse.json(
            { error: "Failed to fetch test cases" },
            { status: 500 }
        );
    }
}
