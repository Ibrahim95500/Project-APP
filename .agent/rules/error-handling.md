# Règles de Gestion des Erreurs

## Quand une erreur est signalée

1. **TOUJOURS** suivre le workflow `/error-resolution`
2. **TOUJOURS** documenter dans `.agent/knowledge/error-log.md`
3. **TOUJOURS** vérifier si l'erreur existe déjà dans le log avant de chercher une solution
4. **TOUJOURS** tester la solution avant de la documenter

## Format de Documentation

Utiliser le template fourni dans `error-log.md` pour chaque nouvelle erreur:
- Numéro séquentiel
- Date
- Fichier(s) concerné(s)
- Type d'erreur
- Description complète
- Code problématique
- Solution appliquée
- Prévention future

## Priorités

1. **Erreurs bloquantes** (empêchent l'utilisation): Résoudre immédiatement
2. **Erreurs fonctionnelles** (fonctionnalité cassée): Résoudre rapidement
3. **Erreurs UX** (expérience dégradée): Résoudre selon priorité
4. **Warnings**: Documenter et planifier

## Capitalisation

- Après 3 erreurs du même type → Créer une règle de prévention
- Après 5 erreurs dans le même domaine → Créer une documentation dédiée
- Mettre à jour `lessons-learned.md` pour les insights importants

## Communication

- Informer l'utilisateur de l'analyse en cours
- Expliquer la cause racine de manière claire
- Proposer la solution et demander validation si nécessaire
- Confirmer la résolution après test
