import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { z } from "zod";

// Zod schema for Requirement Object
const requirementSchema = z.object({
    title: z.string().trim().min(1, "Title is required"),
    description: z.string().trim().min(1, "Description is required"),
    priority: z.enum(["Low", "Medium", "High"]),
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

        /* Requests squence variable value from prisma */
        const sequenceResult = await prisma.$queryRaw<{ nextval: bigint }[]>`
            SELECT nextval('requirement_id_seq')
        `;

        const requirementId = `REQ-${sequenceResult[0].nextval.toString().padStart(3, "0")}`;

        const requirement = await prisma.requirement.create({
            data: { 
                ...requirementData,
                requirementId,
            }

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
