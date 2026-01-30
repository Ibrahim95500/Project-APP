import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
})

async function main() {
    // Create default admin
    const admin = await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: {
            email: 'admin@example.com',
            name: 'Admin User',
            password: 'securepassword', // TODO: Hash this in real implementation
            role: 'ADMIN',
        },
    })
    console.log({ admin })

    // Create default services
    const haircut = await prisma.service.create({
        data: {
            name: 'Coupe Homme',
            durationMin: 30,
            price: 25.0,
        },
    })

    const beard = await prisma.service.create({
        data: {
            name: 'Taille Barbe',
            durationMin: 15,
            price: 15.0,
        },
    })

    console.log({ haircut, beard })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
