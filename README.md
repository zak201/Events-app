# Events App

Une application moderne de gestion d'événements et de réservation de billets construite avec Next.js 14.

## Fonctionnalités

- 🎫 Création et gestion d'événements
- 🔒 Authentification avec NextAuth.js
- 💳 Paiement sécurisé avec Stripe
- 📱 Interface responsive
- 🎨 Thème clair/sombre
- 📧 Notifications par email
- 🎟️ Génération de billets PDF avec QR code
- 📱 Validation des billets par scan

## Prérequis

- Node.js 18+
- MongoDB
- Compte Stripe
- Compte Resend (pour les emails)
- Compte Cloudinary (pour les images)

## Installation

1. Cloner le projet
```bash
git clone https://github.com/votre-username/events-app.git
cd events-app
```

2. Installer les dépendances
```bash
npm install
```

3. Configurer les variables d'environnement
```bash
cp .env.example .env.local
```

Remplir le fichier `.env.local` avec vos propres valeurs :
```env
# Base de données
MONGODB_URI=

# Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Email (Resend)
RESEND_API_KEY=

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Télécharger les polices pour les PDF
```bash
npm run setup
```

5. Lancer le projet en développement
```bash
npm run dev
```

## Structure du projet

```
├── app/                  # Routes et pages Next.js
├── components/          # Composants React réutilisables
├── lib/                 # Utilitaires et configurations
├── models/             # Modèles Mongoose
├── public/             # Fichiers statiques
└── scripts/            # Scripts utilitaires
```

## Déploiement

1. Construire l'application
```bash
npm run build
```

2. Démarrer en production
```bash
npm start
```

## Configuration Stripe

1. Créer un compte Stripe
2. Ajouter les clés API dans `.env.local`
3. Configurer le webhook Stripe :
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## Licence

MIT 