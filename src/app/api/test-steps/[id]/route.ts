import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
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
