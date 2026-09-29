import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 1. Create a sample requirement
  const requirement = await prisma.requirement.create({
    data: {
      requirementId: "REQ-TEST-001",
      title: "Sample operating temperature requirement",
      description:
        "The system shall maintain an operating temperature between 20°C and 30°C.",
      priority: "High",
    },
  });

  console.log("Requirement created:");
  console.log(requirement);

  // 2. Retrieve the requirement from the database
  const retrievedRequirement = await prisma.requirement.findUnique({
    where: {
      requirementId: "REQ-TEST-001",
    },
  });

  console.log("\nRequirement retrieved from database:");
  console.log(retrievedRequirement);

  await prisma.requirement.delete({
    where: {
        requirementId: "REQ-TEST-001"
    }
  }); 
}

main()
  .catch((error) => {
    console.error("Database test failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
