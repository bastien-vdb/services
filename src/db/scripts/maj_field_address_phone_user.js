const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function updateUsers() {
  const users = await prisma.user.findMany();

  for (const user of users) {
    if (!user.address) {
      // Assignez une valeur par défaut ou effectuez une autre action nécessaire
      await prisma.user.update({
        where: { id: user.id },
        data: {
          address: "NC",
        },
      });
    }

    if (!user.phone) {
      // Assignez une valeur par défaut ou effectuez une autre action nécessaire
      await prisma.user.update({
        where: { id: user.id },
        data: {
          phone: "NC",
        },
      });
    }
  }

  console.log("Mise à jour des utilisateurs terminée");
}

updateUsers()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
