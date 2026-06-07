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

  await prisma.wastePin.deleteMany({
    where: {
      description: {
        contains: 'generated for seeding',
      },
    },
  });

  const sampleLocations = [
    { latitude: 0.3390, longitude: 32.6275 },
    { latitude: 0.3378, longitude: 32.6202 },
    { latitude: 0.3416, longitude: 32.6181 },
    { latitude: 0.3329, longitude: 32.6251 },
    { latitude: 0.3473, longitude: 32.6135 },
    { latitude: 0.3512, longitude: 32.6290 },
    { latitude: 0.3405, longitude: 32.6352 },
    { latitude: 0.3337, longitude: 32.6150 },
  ];

  const wasteImages = {
    PLASTIC: [
      'https://picsum.photos/seed/plastic1/800/600',
      'https://picsum.photos/seed/plastic2/800/600',
      'https://picsum.photos/seed/plastic3/800/600',
    ],
    GLASS: [
      'https://picsum.photos/seed/glass1/800/600',
      'https://picsum.photos/seed/glass2/800/600',
      'https://picsum.photos/seed/glass3/800/600',
    ],
    METAL: [
      'https://picsum.photos/seed/metal1/800/600',
      'https://picsum.photos/seed/metal2/800/600',
      'https://picsum.photos/seed/metal3/800/600',
    ],
    ORGANIC: [
      'https://picsum.photos/seed/organic1/800/600',
      'https://picsum.photos/seed/organic2/800/600',
      'https://picsum.photos/seed/organic3/800/600',
    ],
  };

  const samplePins = sampleLocations.map((location, i) => {
    const wasteType = ["PLASTIC","GLASS","METAL","ORGANIC"][i % 4];
    const images = wasteImages[wasteType] || [];
    const imageUrl = images[i % images.length];
    return {
      title: `Discarded ${wasteType.charAt(0) + wasteType.slice(1).toLowerCase()} #${i + 1}`,
      description: `Sample pin ${i + 1} generated for seeding in Kampala / Nakawa`,
      latitude: location.latitude,
      longitude: location.longitude,
      wasteType: wasteType,
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
