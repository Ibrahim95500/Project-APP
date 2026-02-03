# Lessons Learned - NEXO Project

Ce fichier capture les leçons importantes apprises au cours du développement.

---

## 🎓 Leçon #1 - Server Actions dans Next.js

**Date**: 2026-02-03  
**Contexte**: Implémentation des formulaires d'inscription

### Ce que nous avons appris

Les Server Actions inline dans Next.js nécessitent **obligatoirement** la directive `"use server"` en première ligne de la fonction.

### Pourquoi c'est important

Sans cette directive, Next.js ne peut pas identifier la fonction comme une Server Action et génère une erreur runtime. Cela peut bloquer complètement l'utilisation d'un formulaire.

### Best Practice Adoptée

```tsx
// ✅ CORRECT
<form action={async (formData) => {
    "use server"
    await myServerAction(formData)
}}>

// ❌ INCORRECT
<form action={async (formData) => {
    await myServerAction(formData)
}}>

// ✅ ALTERNATIVE (recommandée pour la réutilisabilité)
// Dans un fichier séparé avec "use server" en haut
"use server"
export async function myServerAction(formData: FormData) {
    // ...
}

// Dans le composant
<form action={myServerAction}>
```

### Impact sur le Projet

- Tous les formulaires doivent suivre cette règle
- Préférer les Server Actions dans des fichiers séparés pour la réutilisabilité
- Vérifier systématiquement lors de la création de nouveaux formulaires

---

## 🎓 Leçon #2 - Séparation des Rôles Utilisateurs

**Date**: 2026-02-03  
**Contexte**: Architecture CLIENT vs PRO

### Ce que nous avons appris

Dans une application multi-rôles, il est **crucial** de bien séparer les routes et les workflows dès le début.

### Pourquoi c'est important

Le mélange des routes CLIENT et PRO peut créer:
- Confusion pour les utilisateurs
- Problèmes de sécurité (accès non autorisés)
- Difficultés de maintenance

### Architecture Adoptée

```
/client/*     → Routes CLIENT (réservation)
/auth/*       → Authentification PRO
/admin/*      → Dashboard PRO (gestion)
```

### Best Practices

1. **Routes séparées** par type d'utilisateur
2. **Middleware de protection** basé sur le rôle
3. **Documentation claire** des différences (CLIENT_VS_PRO.md)
4. **Navbar adaptatif** selon le rôle connecté
5. **Tests séparés** pour chaque parcours utilisateur

### Impact sur le Projet

- Meilleure sécurité
- UX plus claire
- Code plus maintenable
- Facilite l'ajout de nouveaux rôles (ex: ADMIN)

---

## 🎓 Leçon #3 - Vérification d'Email

**Date**: 2026-02-03  
**Contexte**: Sécurité des comptes CLIENT

### Ce que nous avons appris

La vérification d'email est essentielle pour:
- Garantir des emails valides
- Éviter les faux comptes
- Permettre la récupération de mot de passe

### Architecture Adoptée

1. **Token sécurisé**: `crypto.randomBytes(32)` pour générer un token unique
2. **Expiration**: 24 heures pour limiter les risques
3. **Suppression après usage**: Le token est supprimé après vérification
4. **Blocage de connexion**: Impossible de se connecter sans vérification

### Best Practices

```typescript
// Génération sécurisée
const token = crypto.randomBytes(32).toString('hex')
const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)

// Vérification avant connexion
if (user && !user.emailVerified) {
    return { error: "Veuillez vérifier votre email" }
}
```

### Impact sur le Projet

- Comptes plus sécurisés
- Base d'emails valides
- Meilleure confiance des utilisateurs

---

## 🎓 Leçon #4 - Documentation Proactive

**Date**: 2026-02-03  
**Contexte**: Capitalisation sur les erreurs

### Ce que nous avons appris

Documenter les erreurs et leurs solutions **au moment où elles se produisent** permet de:
- Gagner du temps sur les erreurs récurrentes
- Partager les connaissances avec l'équipe
- Améliorer la qualité du code

### Système Mis en Place

1. **error-log.md**: Log de toutes les erreurs et solutions
2. **Workflow error-resolution**: Processus systématique
3. **Règles error-handling**: Guidelines de documentation
4. **lessons-learned.md**: Insights et best practices

### Best Practices

- Documenter **immédiatement** après résolution
- Inclure le **code problématique** et la **solution**
- Ajouter des **conseils de prévention**
- Mettre à jour les **statistiques**

### Impact sur le Projet

- Résolution plus rapide des erreurs futures
- Base de connaissances croissante
- Meilleure qualité de code
- Onboarding facilité pour nouveaux développeurs

---

## 📊 Métriques

- **Leçons documentées**: 4
- **Erreurs résolues**: 2
- **Best practices établies**: 8+
- **Documentation créée**: 5 fichiers

---

## 🎯 Prochaines Leçons à Documenter

- [ ] Gestion des emails avec Resend
- [ ] Optimisation des requêtes Prisma
- [ ] Gestion des états de formulaire
- [ ] Tests E2E avec Playwright

---

*Dernière mise à jour: 2026-02-03*
