
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
    const email = 'test@client.com'
    const password = 'password123'
    const hashedPassword = await bcrypt.hash(password, 10)

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            console.log(`User ${email} already exists.`)
            return
        }

        const user = await prisma.user.create({
            data: {
                name: 'Test Client',
                email,
                password: hashedPassword,
                phone: '0600000000',
                role: 'CLIENT',
                emailVerified: new Date(),
            },
        })

        console.log(`Created verified client user: ${user.email} with password: ${password}`)
    } catch (e) {
        console.error(e)
        process.exit(1)
    } finally {
        await prisma.$disconnect()
    }
}

main()
