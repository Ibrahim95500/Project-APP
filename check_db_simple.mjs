import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Checking PRO users...\n')
  
  const users = await prisma.user.findMany({
    where: { role: 'PRO' }
  })
  
  console.log(`Found ${users.length} PRO user(s):\n`)
  
  users.forEach(u => {
    console.log(`- Email: ${u.email}`)
    console.log(`  Name: ${u.name || 'N/A'}`)
    console.log(`  Business: ${u.businessName || 'N/A'}`)
    console.log(`  Has password: ${u.password ? 'YES' : 'NO'}`)
    console.log('')
  })
  
  if (users.length === 0) {
    console.log('⚠️  NO PRO USERS FOUND!')
    console.log('You need to create a PRO account at /auth/register\n')
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())
