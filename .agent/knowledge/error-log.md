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

## 📝 Template pour Nouvelles Erreurs

```markdown
## 🔴 Erreur #X - [Titre Court]

**Date**: YYYY-MM-DD  
**Fichier**: `/chemin/vers/fichier`  
**Type**: [Runtime/Compile/Logic/UX/etc.]

### Description de l'Erreur
[Message d'erreur exact ou description du problème]

### Contexte
[Quand/comment l'erreur se produit]

### Code Problématique
```[language]
[Code qui cause l'erreur]
```

### Solution Appliquée
```[language]
[Code corrigé]
```

### Prévention Future
- [Action 1]
- [Action 2]

### Fichiers Concernés
- `/fichier1` ✅/❌
- `/fichier2` ✅/❌
```

---

## 📊 Statistiques

- **Total d'erreurs résolues**: 3
- **Erreurs Runtime**: 1
- **Erreurs UX/Routing**: 1
- **Erreurs Authentication**: 1
- **Taux de résolution**: 100%

---

## 🎯 Catégories d'Erreurs

### Runtime Errors
- [#1] "use server" manquant

### UX/Routing Issues
- [#2] Confusion routes CLIENT vs PRO

### Authentication Errors
- [#3] CallbackRouteError - trailing comma dans signIn

### Database Errors
- Aucune pour l'instant

### Email/Notification Errors
- Aucune pour l'instant

---

*Dernière mise à jour: 2026-02-03*
