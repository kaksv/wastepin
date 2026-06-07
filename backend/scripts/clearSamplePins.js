import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const deleted = await prisma.wastePin.deleteMany({
    where: {
      description: {
        contains: "generated for seeding",
      },
    },
  });

  console.log(`Deleted ${deleted.count} seeded sample pins.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
