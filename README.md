# SaaS Appointment MVP

Web app SaaS de réservation (MVP) basée sur Next.js, TypeScript, Metronic et Prisma.

## Stack Technique

- **Framework** : Next.js 16 (App Router)
- **Langage** : TypeScript
- **UI** : Metronic (KeenThemes) + ReUI (Tailwind CSS)
- **Base de données** : PostgreSQL
- **ORM** : Prisma
- **Authentification** : (À venir) NextAuth / Metronic Auth

## Prérequis

- Node.js 18+
- Docker & Docker Compose (pour la base de données)

## Initialisation

1.  **Cloner le projet**

2.  **Installer les dépendances**
    ```bash
    npm install
    ```

3.  **Configurer l'environnement**
    Le fichier `.env` est automatiquement configuré pour le développement local via Docker.
    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/appointment_db"
    ```

4.  **Démarrer la Base de Données**
    ```bash
    docker-compose up -d
    ```

5.  **Initialiser la Base de Données (Migration & Seed)**
    ```bash
    npx prisma migrate dev
    npx prisma db seed
    ```

6.  **Lancer le serveur de développement**
    ```bash
    npm run dev
    ```
    Accéder à [http://localhost:3000](http://localhost:3000)

## Architecture

- `app/` : Routes et pages Next.js (App Router)
- `components/` : Composants React (Metronic + ReUI)
- `lib/` : Utilitaires (Prisma singleton, utils)
- `prisma/` : Schéma de base de données et seeds

## Conventions de Contribution

- **Commits** : Conventionnal Commits (ex: `feat: add booking form`, `fix: calendar timezone`).
- **Branchement** : Créer une branche par fonctionnalité (`feat/nom-fonctionnalite`).

## License

Usage privé. Propriété de Ibrahim Nifa.
Ne pas distribuer les assets Metronic publiquement sans licence appropriée.
