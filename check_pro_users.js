const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function checkProUsers() {
    console.log('🔍 Vérification des utilisateurs PRO...\n')

    try {
        // Récupérer tous les utilisateurs PRO
        const proUsers = await prisma.user.findMany({
            where: { role: 'PRO' },
            select: {
                id: true,
                email: true,
                name: true,
                businessName: true,
                role: true,
                emailVerified: true,
                password: true,
                createdAt: true
            }
        })

        if (proUsers.length === 0) {
            console.log('❌ Aucun utilisateur PRO trouvé dans la base de données!\n')
            console.log('💡 Vous devez créer un compte PRO via /auth/register\n')
        } else {
            console.log(`✅ ${proUsers.length} utilisateur(s) PRO trouvé(s):\n`)

            for (const user of proUsers) {
                console.log('─────────────────────────────────────')
                console.log(`📧 Email: ${user.email}`)
                console.log(`👤 Nom: ${user.name || 'Non défini'}`)
                console.log(`🏢 Établissement: ${user.businessName || 'Non défini'}`)
                console.log(`🔐 Mot de passe: ${user.password ? '✅ Défini' : '❌ Non défini'}`)
                console.log(`📅 Créé le: ${user.createdAt.toLocaleDateString('fr-FR')}`)
                console.log(`✉️  Email vérifié: ${user.emailVerified ? '✅ Oui' : '❌ Non'}`)

                // Test de mot de passe si fourni
                if (user.password && process.argv[2] && process.argv[3]) {
                    const testEmail = process.argv[2]
                    const testPassword = process.argv[3]

                    if (user.email === testEmail) {
                        const match = await bcrypt.compare(testPassword, user.password)
                        console.log(`\n🔑 Test mot de passe: ${match ? '✅ CORRECT' : '❌ INCORRECT'}`)
                    }
                }
                console.log('')
            }
        }

        // Vérifier aussi les utilisateurs CLIENT pour comparaison
        const clientCount = await prisma.user.count({
            where: { role: 'CLIENT' }
        })
        console.log(`\nℹ️  Info: ${clientCount} utilisateur(s) CLIENT dans la base\n`)

    } catch (error) {
        console.error('❌ Erreur:', error.message)
    } finally {
        await prisma.$disconnect()
    }
}

console.log('═══════════════════════════════════════')
console.log('   VÉRIFICATION BASE DE DONNÉES NEXO   ')
console.log('═══════════════════════════════════════\n')

if (process.argv[2] && process.argv[3]) {
    console.log(`🔐 Test de connexion pour: ${process.argv[2]}\n`)
}

checkProUsers()
