import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
    throw new Error('DATABASE_URL is not set. Create a .env file with DATABASE_URL.')
}
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    // Hash passwords
    const adminPassword = await bcrypt.hash('securepassword', 10)
    const proPassword = await bcrypt.hash('password123', 10)

    // Create default admin
    const admin = await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: {
            email: 'admin@example.com',
            name: 'Admin User',
            password: adminPassword,
            role: 'ADMIN',
        },
    })
    console.log({ admin })

    // Create default PRO user for testing
    const proUser = await prisma.user.upsert({
        where: { email: 'pro@example.com' },
        update: {},
        create: {
            email: 'pro@example.com',
            name: 'Pro User',
            password: proPassword,
            role: 'PRO',
            businessName: 'Salon de Coiffure Test',
            slug: 'salon-de-coiffure-test',
        },
    })
    console.log({ proUser })
    console.log('\n✅ Compte PRO de test créé:')
    console.log('   Email: pro@example.com')
    console.log('   Mot de passe: password123\n')

    // Create default services for the PRO user (skip if already exist)
    const existingServices = await prisma.service.count({ where: { userId: proUser.id } })
    if (existingServices === 0) {
        const haircut = await prisma.service.create({
            data: {
                userId: proUser.id,
                name: 'Coupe Homme',
                durationMin: 30,
                price: 25.0,
            },
        })
        const beard = await prisma.service.create({
            data: {
                userId: proUser.id,
                name: 'Taille Barbe',
                durationMin: 15,
                price: 15.0,
            },
        })
        console.log({ haircut, beard })
    } else {
        console.log('Services déjà existants pour le compte PRO, skip.')
    }
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
