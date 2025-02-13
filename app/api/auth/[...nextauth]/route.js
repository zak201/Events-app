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
          
          const user = await User.findOne({ 
            email: credentials.email.toLowerCase() 
          }).select('+password');
          
          if (!user) {
            console.log('Utilisateur non trouvé');
            return null;
          }

          const isValid = await user.comparePassword(credentials.password);
          
          if (!isValid) {
            console.log('Mot de passe invalide');
            return null;
          }

          console.log('Utilisateur authentifié:', {
            id: user._id,
            email: user.email,
            role: user.role
          });

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
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        console.log('JWT callback - token mis à jour:', token);
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;
        session.user.id = token.id;
        console.log('Session callback - session mise à jour:', session);
      }
      return session;
    }
  },
  debug: true,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 