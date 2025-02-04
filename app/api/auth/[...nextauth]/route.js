import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { dbConnect } from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' }
      },
      async authorize(credentials) {
        try {
          await dbConnect();
          console.log('Email fourni:', credentials.email);
          
          const user = await User.findOne({ 
            email: credentials.email.toLowerCase() 
          }).select('+password');
          
          console.log('Utilisateur trouvé:', user ? 'Oui' : 'Non');
          if (user) {
            console.log('Email en DB:', user.email);
            console.log('Mot de passe fourni:', credentials.password);
            console.log('Hash en DB:', user.password);
          }
          
          if (!user) {
            console.log('Utilisateur non trouvé');
            return null;
          }

          const isPasswordValid = await user.comparePassword(credentials.password);

          console.log('Vérification du mot de passe:', isPasswordValid);
          
          if (!isPasswordValid) {
            console.log('Mot de passe invalide');
            return null;
          }

          console.log('Connexion réussie');
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role
          };
        } catch (error) {
          console.error('Erreur d\'authentification:', error);
          return null;
        }
      }
    })
  ],
  session: { 
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60 // 30 jours
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    }
  },
  debug: process.env.NODE_ENV === 'development'
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 