import { prisma } from './lib/prisma'
import bcrypt from 'bcryptjs'

async function checkProUsers() {
    console.log('═══════════════════════════════════════')
    console.log('   VÉRIFICATION BASE DE DONNÉES NEXO   ')
    console.log('═══════════════════════════════════════\n')
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
            console.log('❌ AUCUN UTILISATEUR PRO TROUVÉ!\n')
            console.log('💡 Solution: Créez un compte PRO via http://localhost:3000/auth/register\n')
            console.log('   Ensuite, vous pourrez vous connecter sur /auth/login\n')
        } else {
            console.log(`✅ ${proUsers.length} utilisateur(s) PRO trouvé(s):\n`)

            for (const user of proUsers) {
                console.log('─────────────────────────────────────')
                console.log(`📧 Email: ${user.email}`)
                console.log(`👤 Nom: ${user.name || 'Non défini'}`)
                console.log(`🏢 Établissement: ${user.businessName || 'Non défini'}`)
                console.log(`🔐 Mot de passe: ${user.password ? '✅ Défini (hashé)' : '❌ Non défini'}`)
                console.log(`📅 Créé le: ${user.createdAt.toLocaleDateString('fr-FR')}`)
                console.log(`✉️  Email vérifié: ${user.emailVerified ? '✅ Oui' : '❌ Non'}`)
                console.log('')
            }

            console.log('─────────────────────────────────────\n')
            console.log('💡 Pour tester la connexion:')
            console.log('   1. Allez sur http://localhost:3000/auth/login')
            console.log('   2. Utilisez un des emails ci-dessus')
            console.log('   3. Utilisez le mot de passe que vous avez défini lors de l\'inscription\n')
        }

        // Vérifier aussi les utilisateurs CLIENT pour comparaison
        const clientCount = await prisma.user.count({
            where: { role: 'CLIENT' }
        })
        console.log(`ℹ️  Info: ${clientCount} utilisateur(s) CLIENT dans la base\n`)

        // Afficher tous les utilisateurs (sans mot de passe)
        const allUsers = await prisma.user.findMany({
            select: {
                email: true,
                role: true,
                businessName: true,
                name: true
            }
        })

        console.log('📋 TOUS LES UTILISATEURS:')
        console.log('─────────────────────────────────────')
        allUsers.forEach(u => {
            console.log(`${u.role === 'PRO' ? '🏢' : '👤'} ${u.email} (${u.role}) - ${u.businessName || u.name || 'Sans nom'}`)
        })
        console.log('')

    } catch (error: any) {
        console.error('❌ Erreur:', error.message)
    } finally {
        await prisma.$disconnect()
    }
}

checkProUsers()
