# Error Analysis & Solutions Log

Ce fichier documente toutes les erreurs rencontrées dans le projet NEXO et leurs solutions pour référence future.

---

## 🔴 Erreur #1 - "use server" manquant dans form action

**Date**: 2026-02-03  
**Fichier**: `/app/auth/register/page.tsx`  
**Type**: Runtime Error

### Description de l'Erreur
```
Functions cannot be passed directly to Client Components unless you explicitly expose it by marking it with "use server"
```

### Contexte
Lors de l'utilisation d'une fonction inline dans l'attribut `action` d'un formulaire, Next.js nécessite la directive `"use server"` pour indiquer qu'il s'agit d'une Server Action.

### Code Problématique
```tsx
<form action={async (formData) => {
    await registerUser(formData)
}} className="...">
```

### Solution Appliquée
```tsx
<form action={async (formData) => {
    "use server"
    await registerUser(formData)
}} className="...">
```

### Prévention Future
- Toujours ajouter `"use server"` au début des fonctions async inline dans les form actions
- Ou importer directement la Server Action depuis un fichier séparé marqué avec `"use server"` en haut

### Fichiers Concernés
- `/app/auth/register/page.tsx` ✅ Corrigé
- `/app/client/register/page.tsx` ✅ Déjà correct

---

## 🔴 Erreur #2 - Confusion routes CLIENT vs PRO

**Date**: 2026-02-03  
**Type**: UX / Routing Issue

### Description du Problème
L'utilisateur cliquait sur "Connexion Client" mais arrivait sur la page de connexion PRO.

### Cause Racine
Manque de clarté dans la documentation sur la séparation des routes entre CLIENT et PRO.

### Routes Correctes

**CLIENT**:
- Inscription: `/client/register`
- Connexion: `/client/login`
- Dashboard: `/client/dashboard`

**PRO**:
- Inscription: `/auth/register`
- Connexion: `/auth/login`
- Dashboard: `/admin`

### Solution Appliquée
1. Vérification que le Navbar pointe vers les bonnes routes
2. Création de documentation `CLIENT_VS_PRO.md`
3. Clarification dans le walkthrough

### Prévention Future
- Toujours vérifier les liens dans le Navbar après modification
- Maintenir la documentation `CLIENT_VS_PRO.md` à jour
- Tester les deux parcours utilisateurs séparément

---

## 🔴 Erreur #3 - CallbackRouteError dans signIn

**Date**: 2026-02-03  
**Fichier**: `/app/auth/login/page.tsx`  
**Type**: Authentication Error / Syntax Error

### Description de l'Erreur
```
Error [CallbackRouteError]: Read more at https://errors.authjs.dev#callbackrouteerror
    at async action (app/auth/login/page.tsx:52:33)
```

### Contexte
Lors de la tentative de connexion PRO via le formulaire `/auth/login`, l'appel à `signIn("credentials")` échoue avec une CallbackRouteError.

### Code Problématique
```tsx
await signIn("credentials", {
    email: formData.get("email"),
    password: formData.get("password"),
    redirectTo: "/admin",  // ❌ Virgule finale problématique
})
```

### Cause Racine
La virgule finale (trailing comma) après le dernier paramètre `redirectTo` dans l'objet de configuration de `signIn` peut causer des problèmes avec certaines versions de Next.js/Auth.js.

### Solution Appliquée
```tsx
await signIn("credentials", {
    email: formData.get("email"),
    password: formData.get("password"),
    redirectTo: "/admin"  // ✅ Pas de virgule finale
})
```

### Prévention Future
- Éviter les trailing commas dans les objets de configuration Auth.js
- Vérifier la syntaxe des appels à `signIn` et `signOut`
- Tester la connexion après toute modification du formulaire de login

### Fichiers Concernés
- `/app/auth/login/page.tsx` ✅ Corrigé
- `/app/client/login/page.tsx` ⚠️ À vérifier

---

## 🔴 Erreur #4 - "Une erreur inattendue est survenue" lors de la réservation client

**Date**: 2026-02-10  
**Fichier**: `/app/actions/booking.ts`, `/app/client/book/BookingCalendar.tsx`  
**Type**: Logic Error / Incomplete Implementation

### Description de l'Erreur
```
Une erreur inattendue est survenue
```
L'erreur s'affichait sur l'interface de réservation client lors de la tentative de confirmation.

### Contexte
L'interface de réservation pour les clients connectés utilisait une action serveur `createAppointment` qui était un simple placeholder. De plus, les données nécessaires (comme l'ID du professionnel) n'étaient pas correctement passées depuis le composant client.

### Code Problématique
Côté client (`BookingCalendar.tsx`) :
```tsx
const formData = new FormData()
formData.append("serviceId", serviceId)
formData.append("date", startAt.toISOString())
```
L'ID du professionnel (`proId`) manquait dans le `FormData`.

Côté serveur (`booking.ts`) :
```tsx
export async function createAppointment(formData: FormData) {
    // Re-use logic or call createPublicAppointment if appropriate
    return createPublicAppointment(formData)
}
```
`createPublicAppointment` attendait des champs de formulaire spécifiques (nom, email, etc.) qui ne sont pas présents pour un client déjà connecté, causant un crash ou une erreur silencieuse attrapée par le bloc `catch`.

### Solution Appliquée
1. **Client**: Ajout de `proId` dans le `FormData`.
2. **Serveur**: Implémentation complète de `createAppointment` utilisant `auth()` pour récupérer les infos de session du client et une logique adaptée pour lier le `customerId` et le `userId` (professionnel) correctement.

### Prévention Future
- Ne jamais laisser de placeholders dans les actions serveur critiques.
- S'assurer que les actions serveur gèrent explicitement les différents types d'utilisateurs (public vs connecté).
- Toujours vérifier que toutes les données requises pour les relations de base de données sont passées au serveur.

### Fichiers Concernés
- `/app/client/book/BookingCalendar.tsx` ✅ Corrigé
- `/app/actions/booking.ts` ✅ Corrigé

---

## 🔴 Erreur #5 - PrismaClientValidationError: Argument `where` needs at least one of `id` arguments

**Date**: 2026-02-12  
**Fichier**: `/app/invoice/[id]/page.tsx`  
**Type**: Runtime Error (Next.js 15 Async Params)

### Description de l'Erreur
```
Invalid prisma.appointment.findUnique() invocation ... Argument where ... needs at least one of id arguments.
```

### Contexte
Dans Next.js 15, les `params` et `searchParams` sont asynchrones. Accéder à `params.id` directement dans un Server Component sans attendre `params` retourne `undefined`, ce qui fait échouer les requêtes Prisma.

### Code Problématique
```tsx
export default async function InvoicePage({ params }: { params: { id: string } }) {
    const appointment = await prisma.appointment.findUnique({
        where: { id: params.id }, // params.id est undefined
```

### Solution Appliquée
```tsx
export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const appointment = await prisma.appointment.findUnique({
        where: { id },
```

### Prévention Future
- Toujours typer `params` comme `Promise<{ ... }>` dans les Server Components.
- Utiliser `const { ... } = await params` avant toute utilisation.
- Appliquer ce pattern systématiquement sur toutes les routes dynamiques (`[id]`, `[slug]`, etc.).

### Fichiers Concernés
- `/app/invoice/[id]/page.tsx` ✅ Corrigé
- `/app/etablissement/[slug]/page.tsx` ✅ Corrigé
- `/app/etablissement/[slug]/reserver/page.tsx` ✅ Corrigé

---


---

## 🔴 Erreur #6 - html2canvas: "Attempting to parse an unsupported color function "lab""

**Date**: 2026-02-12  
**Fichier**: `/components/invoice/InvoiceActions.tsx`  
**Type**: Library Compatibility Error (Tailwind 4 / html2canvas)

### Description de l'Erreur
```
Attempting to parse an unsupported color function "lab"
```

### Contexte
`html2canvas` ne supporte pas encore les nouvelles fonctions de couleur CSS (`lab()`, `oklch()`, etc.) introduites dans les versions récentes des navigateurs et utilisées par défaut par **Tailwind CSS v4**.

### Code Problématique
Le bouton de téléchargement PDF déclenche `html2canvas(element)`, qui parcourt le DOM et échoue en rencontrant une couleur moderne.

### Solution Appliquée
1. **Tentative 1** : Forcer les couleurs en format HEX/RGB via le hook `onclone` d' `html2canvas`. ❌ *Échec : html2canvas plante toujours lors de la lecture initiale des styles.*
2. **Tentative 2** : Remplacement de `html2canvas` par `modern-screenshot`. ✅ *Succès : cette bibliothèque supporte nativement les fonctions de couleur modernes (OKLCH, LAB).*

### Prévention Future
- Éviter `html2canvas` dans les projets utilisant Tailwind v4 ou des standards CSS récents (2024+). Privilégier `modern-screenshot` ou `html-to-image`.

### Fichiers Concernés
- `/components/invoice/InvoiceActions.tsx` ✅ Corrigé

---


---

## 🔴 Erreur #7 - ReferenceError: results is not defined

**Date**: 2026-02-12  
**Fichier**: `/app/admin/page.tsx`  
**Type**: Runtime Error (Logic/Refactoring)

### Description de l'Erreur
```
results is not defined
```

### Contexte
L'erreur s'est produite suite à un refactoring partiel du `Promise.all` dans le tableau de bord administrateur.

### Code Problématique
Le code utilisait la destructuration pour récupérer les résultats d'un `Promise.all`, mais il manquait une variable dans la liste de destructuration, et une ligne plus bas tentait d'accéder à `results[5]` alors que la variable `results` n'existait plus.

### Solution Appliquée
1. Ajout de `pendingAppointments` à la liste de destructuration du `Promise.all`.
2. Suppression de la ligne erronée `const pendingAppointments = results[5]`.

### Prévention Future
- Toujours vérifier que toutes les variables d'une destructuration de `Promise.all` correspondent au nombre d'éléments dans le tableau de promesses.

### Fichiers Concernés
- `/app/admin/page.tsx` ✅ Corrigé

---


---

## 🔴 Erreur #8 - Build Error: Export default doesn't exist in target module (prisma)

**Date**: 2026-02-12  
**Fichier**: `/app/admin/invoices/page.tsx`  
**Type**: Build Error (Import/Export mismatch)

### Description de l'Erreur
```
The export default was not found in module [project]/lib/prisma.ts [app-rsc] (ecmascript). Did you mean to import prisma?
```

### Contexte
L'erreur s'est produite lors de l'accès à la nouvelle page d'historique des factures.

### Code Problématique
```tsx
import prisma from "@/lib/prisma" // Import par défaut incorrect
```

### Solution Appliquée
Changer l'import pour utiliser la destructuration (named import) :
```tsx
import { prisma } from "@/lib/prisma"
```

### Prévention Future
- Toujours vérifier si une utilité interne (comme `prisma`) est exportée en `default` ou en `named export`.
- Utiliser l'auto-complétion de l'IDE pour éviter ce genre d'erreurs de syntaxe d'import.

### Fichiers Concernés
- `/app/admin/invoices/page.tsx` ✅ Corrigé

---

## 📊 Statistiques

- **Total d'erreurs résolues**: 8
- **Erreurs Runtime**: 3
- **Erreurs Build**: 1
- **Erreurs UX/Routing**: 1
- **Erreurs Authentication**: 1
- **Erreurs Logique/Implémentation**: 2
- **Erreurs Bibliothèque**: 0
- **Taux de résolution**: 100%

---

## 🎯 Catégories d'Erreurs

### Runtime Errors
- [#1] "use server" manquant
- [#5] PrismaClientValidationError (Async Params)
- [#7] ReferenceError: results is not defined

### Build Errors
- [#8] Export default doesn't exist (prisma)

### UX/Routing Issues
- [#2] Confusion routes CLIENT vs PRO

### Authentication Errors
- [#3] CallbackRouteError - trailing comma dans signIn

### Library/Compatibility Errors
- [#6] html2canvas lab/oklch color unsupported

### Logic/Implementation Errors
- [#4] "Une erreur inattendue est survenue" lors de la réservation client

---

*Dernière mise à jour: 2026-02-12*
