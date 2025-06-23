import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  // Create users
  const admin = await prisma.user.upsert({
    where: { email: "admin@exemplo.com" },
    update: {},
    create: {
      email: "admin@exemplo.com",
      name: "Administrador",
    },
  })

  const user = await prisma.user.upsert({
    where: { email: "user@exemplo.com" },
    update: {},
    create: {
      email: "user@exemplo.com",
      name: "Usuário Teste",
    },
  })

  // Create posts
  await prisma.post.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: "Primeiro Post",
      content: "Este é o conteúdo do primeiro post de exemplo.",
      published: true,
      authorId: admin.id,
    },
  })

  await prisma.post.upsert({
    where: { id: 2 },
    update: {},
    create: {
      title: "Post em Rascunho",
      content: "Este post ainda não foi publicado.",
      published: false,
      authorId: user.id,
    },
  })

  console.log("Database seeded successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
