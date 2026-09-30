import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { z } from "zod";

// Zod schema for Requirement Object
const requirementSchema = z.object({
    requirementId: z.string(),
    title: z.string(),
    description: z.string(),
    priority: z.enum(["Low", "Medium", "High"]).nullable(),
});


// Create a new Requirement
export async function POST(request: Request) {
    try {
        const body = await request.json();

        const result = requirementSchema.safeParse(body);

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

        const requirementData = result.data

        const requirement = await prisma.requirement.create({
            data: requirementData,
        });

        return NextResponse.json(requirement, { status: 201});
    } catch (error) {
        console.error(error);
        
        return NextResponse.json(
            { error: "Failed to create requirement" },
            { status: 500 }
        );
    }
}


// Gets all requirements
export async function GET(request: Request) {
    try {
        const requirements = await prisma.requirement.findMany();

        return NextResponse.json(requirements, { status: 200});
    } catch (error) {
        console.error(error);
        
        return NextResponse.json(
            { error: "Failed to fetch requirement" },
            { status: 500 }
        );
    }
}
