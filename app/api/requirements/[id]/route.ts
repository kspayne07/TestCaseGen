import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { Prisma } from "@prisma/client";
import { z } from "zod";

// Zod schema for Requirement Object
const patchRequirementSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    priority: z.enum(["Low", "Medium", "High"]).optional(),
    status: z.enum(["Draft", "In Progress", "Complete"]).optional()
});

// Gets one requirement by id
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;


        const requirement = await prisma.requirement.findUnique({
            where: {
                id: Number(id)
            }
        });

        if(!requirement) {
                return NextResponse.json(
                { error: "Requirement not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(requirement, { status: 200});
    } catch (error) {
        console.error(error);
        
        return NextResponse.json(
            { error: "Failed to fetch requirement" },
            { status: 500 }
        );
    }
}

// Deletes a requirement by id
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        const requirement = await prisma.requirement.delete({
            where: {
                id: Number(id)
            }
        });

        return NextResponse.json(requirement, { status: 200});
    } catch (error) {
        console.error(error);

        // If requirement with given id does not exist
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2025"
        ) {
            return NextResponse.json(
                { error: "Requirement not found" },
                { status: 404 }
            );
        }
        
        return NextResponse.json(
            { error: "Failed to delete requirement" },
            { status: 500 }
        );
    }
}

// Create a new Requirement
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        const body = await request.json();

        const result = patchRequirementSchema.safeParse(body);

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

        const requirement = await prisma.requirement.update({
            data: requirementData,
            where: {
                id: Number(id)
            }
        });

        return NextResponse.json(requirement, { status: 200});
    } catch (error) {
        console.error(error);

        // If requirement with given id does not exist
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2025"
        ) {
            return NextResponse.json(
                { error: "Requirement not found" },
                { status: 404 }
            );
        }
        
        return NextResponse.json(
            { error: "Failed to update requirement" },
            { status: 500 }
        );
    }
}


