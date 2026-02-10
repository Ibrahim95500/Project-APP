
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const pros = await prisma.user.findMany({
        where: { role: 'PRO' },
        include: {
            services: true,
            workingHours: true
        }
    })

    console.log(`Found ${pros.length} PRO users.`)
    pros.forEach(pro => {
        console.log(`- ${pro.name} (${pro.businessName}): ${pro.services.length} services, ${pro.workingHours.length} working hours definitions.`)
        pro.services.forEach(s => console.log(`  * ${s.name} (${s.durationMin} min) - ${s.price}€`))
    })
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
