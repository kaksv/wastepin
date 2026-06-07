import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/api/pins", async (req, res) => {
  const { status, claimedById } = req.query;
  const where = {};

  if (status) {
    where.status = status;
  }

  if (claimedById) {
    where.claimedById = claimedById;
  }

  if (!status && !claimedById) {
    where.status = "OPEN";
  }

  const pins = await prisma.wastePin.findMany({
    where,
    include: {
      creator: true,
      claimedBy: true,
    },
    orderBy: { createdAt: "desc" },
  });
  res.json(pins);
});

app.delete("/api/pins/sample", async (req, res) => {
  const deleted = await prisma.wastePin.deleteMany({
    where: {
      description: {
        contains: "generated for seeding",
      },
    },
  });

  res.json({ deletedCount: deleted.count });
});

app.post("/api/pins", async (req, res) => {
  const { title, description, latitude, longitude, wasteType, quantity, contact, creatorId, photos } = req.body;

  if (!title || latitude == null || longitude == null || !wasteType || !quantity) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const pin = await prisma.wastePin.create({
    data: {
      title,
      description,
      latitude,
      longitude,
      wasteType,
      quantity,
      contact,
      photos,
      creatorId,
    },
  });

  res.status(201).json(pin);
});

app.post("/api/pins/:id/claim", async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  const pin = await prisma.wastePin.findUnique({ where: { id } });
  if (!pin || pin.status !== "OPEN") {
    return res.status(400).json({ error: "Pin is not available for claim" });
  }

  const claimedPin = await prisma.wastePin.update({
    where: { id },
    data: {
      status: "CLAIMED",
      claimedById: userId,
      claimedAt: new Date(),
    },
  });

  res.json(claimedPin);
});

app.patch("/api/pins/:id/complete", async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  const pin = await prisma.wastePin.findUnique({ where: { id } });
  if (!pin || pin.status !== "CLAIMED" || pin.claimedById !== userId) {
    return res.status(400).json({ error: "Pin is not eligible for completion" });
  }

  const completedPin = await prisma.wastePin.update({
    where: { id },
    data: {
      status: "COMPLETED",
      completedAt: new Date(),
    },
  });

  await prisma.user.update({
    where: { id: userId },
    data: {
      reputation: { increment: 1 },
      points: { increment: 10 },
    },
  });

  res.json(completedPin);
});

app.get("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json(user);
});

app.post("/api/users", async (req, res) => {
  const { name, phone, role } = req.body;
  const user = await prisma.user.create({
    data: { name, phone, role },
  });
  res.status(201).json(user);
});

app.listen(PORT, () => {
  console.log(`WastePin backend listening on http://localhost:${PORT}`);
});
