
import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
    throw new Error('DATABASE_URL is not set.')
}
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    const users = await prisma.user.findMany({
        where: { role: 'PRO' },
        include: {
            services: true
        }
    })

    console.log('--- Pros and Services ---')
    users.forEach(user => {
        console.log(`Pro: ${user.name} (${user.email}) - ID: ${user.id}`)
        if (user.services.length === 0) {
            console.log('  No services found.')
        }
        user.services.forEach(service => {
            console.log(`  - Service: ${service.name} (Active: ${service.active}, ID: ${service.id})`)
        })
    })

    const allServices = await prisma.service.findMany()
    console.log('\n--- All Services in DB ---')
    allServices.forEach(s => {
        console.log(`Service: ${s.name} (Active: ${s.active}, UserID: ${s.userId})`)
    })
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
