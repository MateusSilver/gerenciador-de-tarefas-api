import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();

  const user = await prisma.user.create({
    data: {
      name: "Evaldo (Teste)",
      email: "teste@exemplo.com",
      tasks: {
        create: [
          {
            title: "Dominar App Router do Next.js",
            description: "Estudar diferença entre Server e Client Components",
            status: "IN_PROGRESS",
            priority: "HIGH",
          },
          {
            title: "Configurar banco de dados",
            description: "Finalizar setup do Neon e Prisma com seed",
            status: "DONE",
            priority: "HIGH",
          },
        ],
      },
    },
  });

  console.log("Seed executado com sucesso! Usuário criado:", user.name);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
