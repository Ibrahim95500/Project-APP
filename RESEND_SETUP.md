# Configuration Resend pour NEXO

## 📧 Étapes de Configuration

### 1. Créer un Compte Resend

1. Allez sur [resend.com](https://resend.com)
2. Créez un compte gratuit (3000 emails/mois inclus)
3. Vérifiez votre email

### 2. Obtenir votre Clé API

1. Connectez-vous à votre dashboard Resend
2. Allez dans **API Keys**
3. Cliquez sur **Create API Key**
4. Donnez-lui un nom (ex: "NEXO Production")
5. Copiez la clé (elle commence par `re_`)

### 3. Configurer les Variables d'Environnement

Ajoutez ces lignes dans votre fichier `.env` :

```env
# Resend Email Configuration
RESEND_API_KEY=re_votre_cle_api_ici
RESEND_FROM_EMAIL=NEXO <noreply@votre-domaine.com>

# URL de l'application (pour les liens dans les emails)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Note** : En production, remplacez `http://localhost:3000` par votre URL réelle.

### 4. Configurer votre Domaine (Optionnel mais Recommandé)

Pour une meilleure délivrabilité :

1. Dans Resend, allez dans **Domains**
2. Cliquez sur **Add Domain**
3. Entrez votre domaine (ex: `votre-domaine.com`)
4. Suivez les instructions pour ajouter les enregistrements DNS
5. Une fois vérifié, utilisez `noreply@votre-domaine.com` dans `RESEND_FROM_EMAIL`

### 5. Tester l'Envoi d'Emails

1. Redémarrez votre serveur de développement :
   ```bash
   npm run dev
   ```

2. Créez un rendez-vous via l'interface
3. Vérifiez votre boîte email pour la confirmation

## 🔍 Vérification

Pour vérifier que tout fonctionne :

1. Allez sur votre dashboard Resend
2. Cliquez sur **Emails** dans le menu
3. Vous devriez voir les emails envoyés avec leur statut

## ⚠️ Limites du Plan Gratuit

- **3000 emails/mois**
- **100 emails/jour**
- Parfait pour le développement et les petites applications

Pour plus d'emails, consultez les [plans payants de Resend](https://resend.com/pricing).

## 🐛 Dépannage

### L'email n'arrive pas

1. Vérifiez que `RESEND_API_KEY` est bien définie
2. Vérifiez les logs du serveur pour les erreurs
3. Consultez le dashboard Resend pour voir si l'email a été envoyé
4. Vérifiez vos spams

### Erreur "Invalid API Key"

- Vérifiez que la clé commence par `re_`
- Assurez-vous qu'il n'y a pas d'espaces avant/après la clé
- Redémarrez le serveur après avoir modifié `.env`

### Emails marqués comme spam

- Configurez votre propre domaine (voir étape 4)
- Ajoutez les enregistrements SPF, DKIM et DMARC
- Évitez les mots "spam" dans le contenu

## 📚 Ressources

- [Documentation Resend](https://resend.com/docs)
- [Guide de Configuration DNS](https://resend.com/docs/dashboard/domains/introduction)
- [Exemples de Templates](https://resend.com/docs/send-with-nextjs)
