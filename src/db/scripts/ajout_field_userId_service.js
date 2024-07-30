const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function updateServices() {
  const userId = "667b2051bdc965b547bc526e";

  try {
    // Mettre à jour tous les enregistrements de la table Service pour ajouter le champ userId
    const updatedServices = await prisma.service.updateMany({
      data: {
        userId: userId,
      },
    });
  } catch (error) {
    console.error("Error updating services:", error);
  } finally {
    await prisma.$disconnect();
  }
}

updateServices();
