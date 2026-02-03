#!/usr/bin/env node

/**
 * Script pour vérifier les utilisateurs PRO dans la base de données
 */

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function checkProUsers() {
    try {
        console.log('🔍 Recherche des utilisateurs PRO...\n')
        
        const proUsers = await prisma.user.findMany({
            where: {
                role: 'PRO'
            },
            select: {
                id: true,
                email: true,
                name: true,
                businessName: true,
                role: true,
                password: true, // Pour vérifier si le hash existe
                createdAt: true
            }
        })

        if (proUsers.length === 0) {
            console.log('❌ Aucun utilisateur PRO trouvé dans la base de données\n')
            console.log('💡 Vous devez créer un compte PRO via /auth/register\n')
        } else {
            console.log(`✅ ${proUsers.length} utilisateur(s) PRO trouvé(s):\n`)
            
            proUsers.forEach((user, index) => {
                console.log(`--- Utilisateur #${index + 1} ---`)
                console.log(`Email: ${user.email}`)
                console.log(`Nom: ${user.name || 'Non défini'}`)
                console.log(`Établissement: ${user.businessName || 'Non défini'}`)
                console.log(`Rôle: ${user.role}`)
                console.log(`Mot de passe hashé: ${user.password ? '✅ Oui' : '❌ Non (OAuth uniquement)'}`)
                console.log(`Créé le: ${user.createdAt.toLocaleString('fr-FR')}`)
                console.log('')
            })
        }

        // Vérifier aussi les utilisateurs CLIENT pour comparaison
        const clientUsers = await prisma.user.findMany({
            where: {
                role: 'CLIENT'
            }
        })

        console.log(`ℹ️  Info: ${clientUsers.length} utilisateur(s) CLIENT dans la base\n`)

    } catch (error) {
        console.error('❌ Erreur lors de la vérification:', error.message)
    } finally {
        await prisma.$disconnect()
    }
}

checkProUsers()
