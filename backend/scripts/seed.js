import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function randomOffset() {
  return (Math.random() - 0.5) * 0.02; // ~±0.01 degrees
}

async function main() {
  console.log("Seeding database with sample users and waste pins...");

  // Create sample users
  const alice = await prisma.user.upsert({
    where: { phone: "+10000000001" },
    update: {},
    create: { name: "Alice", phone: "+10000000001", role: "GENERATOR" },
  });

  const bob = await prisma.user.upsert({
    where: { phone: "+10000000002" },
    update: {},
    create: { name: "Bob", phone: "+10000000002", role: "HAULER" },
  });

  const baseLat = -1.2921; // example center (Nairobi)
  const baseLon = 36.8219;

  const samplePins = Array.from({ length: 8 }).map((_, i) => {
    const lat = baseLat + randomOffset();
    const lon = baseLon + randomOffset();
    const seed = `wastepin-${i}`;
    const imageUrl = `https://picsum.photos/seed/${seed}/800/600`;
    return {
      title: `Discarded ${["Plastic","Glass","Metal","Organic"][i % 4]} #${i + 1}`,
      description: `Sample pin ${i + 1} generated for seeding`,
      latitude: lat,
      longitude: lon,
      wasteType: ["PLASTIC","GLASS","METAL","ORGANIC"][i % 4],
      quantity: `${(i + 1) * 2} kg`,
      contact: i % 2 === 0 ? "+1000111222" : null,
      photos: JSON.stringify([imageUrl]),
      creatorId: i % 2 === 0 ? alice.id : bob.id,
    };
  });

  for (const pinData of samplePins) {
    await prisma.wastePin.create({ data: pinData });
  }

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
