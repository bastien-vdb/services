const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function updateActiveUser() {
  try {
    // Mettre à jour tous les enregistrements de la table User pour ajouter les rendre actifs
    await prisma.user.updateMany({
      data: {
        active: true,
      },
    });
  } catch (error) {
    console.error("Error updating users:", error);
  } finally {
    await prisma.$disconnect();
  }
}

updateActiveUser();
