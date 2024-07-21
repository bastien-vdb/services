const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Mettre à jour tous les utilisateurs pour ajouter un champ `role` avec la valeur par défaut "EMPLOYER"
  await prisma.user.updateMany({
    data: {
      role: "OWNER",
    },
  });

  console.log("All users have been updated with the default role.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
