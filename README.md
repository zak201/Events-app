# Events App

Une application web de gestion d'événements et de réservations construite avec Next.js 14.

## 🚀 Fonctionnalités

- 👥 Authentification utilisateur (NextAuth.js)
- 📅 Création et gestion d'événements
- 🎟️ Système de réservation avec QR codes
- 📧 Notifications par email (Resend)
- 🎨 Interface adaptative (dark/light mode)
- 📱 Design responsive
- 🔒 Rôles utilisateur (organisateur/participant)

## 🛠️ Technologies

- **Framework**: Next.js 14
- **Base de données**: MongoDB avec Mongoose
- **Authentification**: NextAuth.js
- **Styles**: Tailwind CSS
- **Emails**: Resend
- **Paiements**: Stripe (à venir)
- **PDF**: @react-pdf/renderer
- **QR Codes**: qrcode (à venir)

## 🚦 Prérequis

- Node.js 18+
- MongoDB
- Compte Stripe
- Compte Resend

## ⚙️ Configuration

1. Clonez le repository
```bash
git clone https://github.com/votre-username/events-app.git
```

2. Installez les dépendances
```bash
npm install
```

3. Créez un fichier `.env.local` avec les variables suivantes :
```env
# Base de données
MONGODB_URI=

# Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=

# Email
RESEND_API_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Lancez le serveur de développement
```bash
npm run dev
```

## 📁 Structure du Projet

```
events-app/
├── app/                   # Routes et pages Next.js
├── components/           # Composants React réutilisables
├── lib/                  # Utilitaires et configurations
├── models/              # Modèles Mongoose
├── public/              # Assets statiques
└── styles/              # Styles globaux
```

## 🔐 Rôles Utilisateur

- **Organisateur**: Peut créer/gérer des événements
- **Participant**: Peut réserver des places


# EventBooking - Application de Gestion d'Événements

## 📖 Vue d'ensemble

EventBooking est une application web complète permettant la gestion et la réservation d'événements. Elle utilise Next.js 14, MongoDB, et intègre l'authentification avec NextAuth.js.

## 🏗 Structure du Projet

### 📁 /app
Structure principale de l'application Next.js 14 avec App Router.

- `layout.js` : Layout principal de l'application avec configuration des métadonnées et providers
- `page.js` : Page d'accueil avec composant client suspense
- `/api/` : Routes API de l'application
  - `auth/` : Gestion de l'authentification (NextAuth)
  - `events/` : CRUD des événements
  - `reservations/` : Gestion des réservations

### 📁 /components
Composants React réutilisables

#### Composants principaux
- `Navbar.js` : Barre de navigation responsive avec menu utilisateur
- `UserMenu.js` : Menu déroulant pour les actions utilisateur
- `EventCard.js` : Carte affichant les détails d'un événement
- `EventList.js` : Liste paginée des événements avec recherche

#### Modales
- `CreateEventModal.js` : Création d'événements
- `EditEventModal.js` : Modification d'événements
- `ReservationModal.js` : Processus de réservation

### 📁 /lib
Utilitaires et configurations

- `api/` : Fonctions d'appel API
- `mongodb.js` : Configuration de la connexion MongoDB
- `utils.js` : Fonctions utilitaires (formatage, validation)
- `validations/` : Schémas de validation Zod

### 📁 /models
Modèles Mongoose

- `Event.js` : Schéma des événements
- `User.js` : Schéma utilisateur
- `Reservation.js` : Schéma des réservations

## 🔑 Fonctionnalités Clés

### Authentification
- Système complet avec NextAuth.js
- Rôles utilisateur (organisateur/participant)
- Sessions persistantes avec MongoDB

### Gestion des Événements
- CRUD complet pour les organisateurs
- Upload d'images avec Cloudinary
- Validation des données avec Zod

### Réservations
- Système de réservation en temps réel
- Gestion des places disponibles
- Notifications par email (Resend)

### Interface Utilisateur
- Design responsive avec Tailwind CSS
- Thème clair/sombre
- Animations avec Framer Motion

## 🛠 Configuration Technique

### Prérequis
- Node.js 18+
- MongoDB
- Compte Cloudinary pour les images
- Compte Resend pour les emails

### Variables d'Environnement
env
MONGODB_URI=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
RESEND_API_KEY=

## 🔄 Workflow de Développement

1. Les composants client utilisent React Hooks et Context
2. Les routes API suivent le pattern REST
3. La validation des données est centralisée avec Zod
4. Les erreurs sont gérées de manière consistante

## 🔒 Sécurité

- Authentification sécurisée avec NextAuth.js
- Validation des données côté serveur
- Protection CSRF intégrée
- Sessions sécurisées avec JWT

## 🚀 Performance

- Optimisation des images avec next/image
- Lazy loading des composants
- Mise en cache avec LRU Cache
- Analytics avec Vercel

## 📱 Responsive Design

- Interface mobile-first avec Tailwind CSS
- Breakpoints cohérents
- Composants adaptifs

## 🧪 Tests

(pas de tests pour le moment)

## 📈 Monitoring

- Vercel Analytics intégré
- Logs d'erreurs centralisés
- Métriques de performance


## 📝 License


# Documentation Technique EventBooking

## Architecture Globale

### Frontend (Next.js 14)
Le frontend utilise l'App Router de Next.js 14, permettant un rendu hybride (Server et Client Components).

#### Structure des dossiers frontend

##### 📁 /app
```
/app
├── layout.js            # Layout principal avec providers et configuration globale
├── page.js             # Page d'accueil avec liste des événements
├── auth/               # Pages d'authentification
├── dashboard/          # Interface organisateur
├── events/            # Pages des événements
└── reservations/      # Gestion des réservations
```

**Détails des fichiers clés:**
- `layout.js`: Configure les providers globaux (NextAuth, Theme, Analytics)
- `page.js`: Implémente la page d'accueil avec recherche d'événements
- `events/[id]/page.js`: Affiche les détails d'un événement
- `dashboard/events/page.js`: Interface de gestion des événements pour les organisateurs

##### 📁 /components
```
/components
├── common/            # Composants réutilisables
├── forms/            # Composants de formulaire
├── layout/           # Composants de mise en page
└── modals/           # Fenêtres modales
```

**Composants principaux:**
- `EventCard.js`: Affiche un événement avec ses informations essentielles
- `UserMenu.js`: Menu déroulant avec actions utilisateur
- `ReservationForm.js`: Formulaire de réservation avec validation
- `EditEventModal.js`: Modal d'édition d'événement

### Backend (API Routes)

#### Structure de l'API
```
/app/api
├── auth/              # Routes d'authentification
├── events/           # CRUD événements
└── reservations/     # Gestion réservations
```

**Points d'entrée API principaux:**

1. Authentication:
```javascript
POST /api/auth/register    # Inscription utilisateur
POST /api/auth/login       # Connexion
```

2. Événements:
```javascript
GET    /api/events        # Liste des événements
POST   /api/events        # Création d'événement
PUT    /api/events/:id    # Modification
DELETE /api/events/:id    # Suppression
```

3. Réservations:
```javascript
POST   /api/reservations  # Création réservation
GET    /api/reservations  # Liste des réservations
PATCH  /api/reservations/:id/status  # Mise à jour statut
```

### Base de données (MongoDB)

#### 📁 /models
Définition des schémas Mongoose:

1. `Event.js`:
```javascript
{
  title: String,
  description: String,
  date: Date,
  location: String,
  capacity: Number,
  organizerId: ObjectId,
  imageUrl: String,
  reservedSeats: Number
}
```

2. `User.js`:
```javascript
{
  name: String,
  email: String,
  password: String,
  role: Enum['utilisateur', 'organisateur']
}
```

3. `Reservation.js`:
```javascript
{
  eventId: ObjectId,
  userId: ObjectId,
  seats: Number,
  status: Enum['pending', 'confirmed', 'cancelled']
}
```

### Utilitaires et Configuration

#### 📁 /lib
```
/lib
├── api/              # Fonctions d'appel API
├── validations/      # Schémas Zod
├── mongodb.js        # Configuration MongoDB
└── utils.js         # Fonctions utilitaires
```

**Fichiers importants:**
- `mongodb.js`: Gère la connexion à MongoDB avec pattern singleton
- `uploadImage.js`: Intégration avec Cloudinary
- `validations/`: Schémas de validation avec Zod

### Sécurité et Authentification

#### Configuration NextAuth
```javascript
// app/api/auth/[...nextauth]/route.js
export const authOptions = {
  providers: [
    CredentialsProvider({...}),
  ],
  callbacks: {
    jwt: async ({token, user}) => {...},
    session: async ({session, token}) => {...}
  }
}
```

### Gestion des États

1. **Server State**: 
- Utilisation de Server Components pour les données statiques
- Revalidation avec Next.js Cache

2. **Client State**:
- React Hooks pour la gestion locale
- Context API pour l'état global

### Performance et Optimisation

1. **Images**:
- Optimisation automatique avec next/image
- CDN Cloudinary pour le stockage

2. **JavaScript**:
- Code splitting automatique
- Lazy loading des composants


### Tests et Qualité

(À implémenter)
- Tests unitaires avec Jest
- Tests d'intégration avec Cypress
- E2E tests

### Déploiement

1. **Prérequis**:
- Variables d'environnement configurées
- Base de données MongoDB
- Comptes services (Cloudinary, Resend)

2. **Commandes**:
```bash
npm run build
npm start
```





By ANOUAR Zakaria