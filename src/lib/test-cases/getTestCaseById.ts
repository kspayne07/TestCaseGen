import "server-only";

import { prisma } from "@/lib/prisma";

export async function getTestCaseById(id: number) {
    return await prisma.testCase.findUnique({
        where: {
            id: id,
        },
        include: {
            requirements: {
                include: {
                    requirement: true,
                },
            },
            steps: {
                orderBy: {
                    stepNumber: "asc",
                },
            },
        },
    });
}