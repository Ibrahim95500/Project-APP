---
description: Workflow pour analyser et résoudre les erreurs de manière systématique
---

# Workflow: Analyse et Résolution d'Erreurs

Ce workflow doit être suivi chaque fois qu'une erreur est signalée.

## Étape 1: Capture de l'Erreur

// turbo
Lorsque l'utilisateur signale une erreur:

1. **Demander les détails** (si non fournis):
   - Message d'erreur exact
   - Page/route où l'erreur se produit
   - Actions qui déclenchent l'erreur
   - Capture d'écran si disponible

2. **Identifier le type d'erreur**:
   - Runtime Error (erreur d'exécution)
   - Compile Error (erreur de compilation)
   - Logic Error (erreur de logique)
   - UX Issue (problème d'expérience utilisateur)
   - Database Error (erreur de base de données)
   - Authentication Error (erreur d'authentification)

## Étape 2: Analyse de l'Erreur

1. **Localiser le fichier concerné**:
   ```bash
   # Rechercher dans les logs ou le message d'erreur
   grep -r "message d'erreur" .
   ```

2. **Examiner le code**:
   - Ouvrir le fichier identifié
   - Lire le contexte autour de la ligne d'erreur
   - Vérifier les imports et dépendances

3. **Identifier la cause racine**:
   - Qu'est-ce qui cause vraiment l'erreur ?
   - Y a-t-il des erreurs similaires ailleurs ?

## Étape 3: Recherche de Solution

1. **Vérifier le fichier error-log.md**:
   - L'erreur a-t-elle déjà été rencontrée ?
   - Une solution existe-t-elle déjà ?

2. **Si nouvelle erreur**:
   - Rechercher dans la documentation Next.js/React
   - Vérifier les issues GitHub similaires
   - Analyser les best practices

## Étape 4: Application de la Solution

// turbo
1. **Corriger le code**:
   - Appliquer la solution identifiée
   - Vérifier qu'il n'y a pas d'effets de bord

2. **Tester la correction**:
   - Reproduire le scénario qui causait l'erreur
   - Vérifier que l'erreur est résolue
   - Tester les cas limites

## Étape 5: Documentation

1. **Mettre à jour error-log.md**:
   - Ajouter une nouvelle entrée avec le template
   - Inclure le code problématique et la solution
   - Ajouter des conseils de prévention

2. **Mettre à jour les statistiques**:
   - Incrémenter le compteur d'erreurs résolues
   - Mettre à jour les catégories

3. **Créer une note dans lessons-learned.md** (si applicable):
   - Si l'erreur révèle un pattern important
   - Si elle nécessite un changement d'architecture

## Étape 6: Prévention

1. **Identifier les fichiers similaires**:
   - Y a-t-il d'autres endroits avec le même pattern ?
   - Faut-il appliquer la correction ailleurs ?

2. **Créer une règle/guideline** (si nécessaire):
   - Ajouter dans `.agent/rules/` si c'est un pattern récurrent
   - Documenter dans le README si c'est important

## Checklist Rapide

- [ ] Erreur capturée et détaillée
- [ ] Type d'erreur identifié
- [ ] Fichier(s) concerné(s) localisé(s)
- [ ] Cause racine identifiée
- [ ] Solution trouvée et testée
- [ ] Code corrigé
- [ ] error-log.md mis à jour
- [ ] Tests de non-régression effectués
- [ ] Prévention documentée

## Exemples d'Utilisation

### Exemple 1: Runtime Error
```
Utilisateur: "J'ai une erreur 'use server' sur /auth/register"
→ Suivre Étape 1-6
→ Documenter dans error-log.md
→ Vérifier les autres formulaires
```

### Exemple 2: UX Issue
```
Utilisateur: "Le lien Client m'amène sur la page Pro"
→ Analyser le routing
→ Corriger les liens
→ Créer documentation CLIENT_VS_PRO.md
→ Documenter dans error-log.md
```

## Notes Importantes

- **Toujours documenter**: Même les petites erreurs peuvent se reproduire
- **Penser prévention**: Chercher les patterns similaires
- **Capitaliser**: Chaque erreur est une opportunité d'apprentissage
