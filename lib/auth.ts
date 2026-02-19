import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import connectDB from '@/lib/mongodb';
import { Admin } from '@/models/Admin';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.log('❌ Missing credentials');
            throw new Error('Please provide email and password');
          }

          console.log('🔍 Attempting login for:', credentials.email);
          
          await connectDB();
          console.log('✅ Database connected');
          
          const admin = await Admin.findOne({ email: credentials.email, active: true });
          
          if (!admin) {
            console.log('❌ Admin not found or inactive');
            throw new Error('Invalid credentials');
          }

          console.log('✅ Admin found:', admin.email);
          console.log('🔐 Testing password...');
          
          const isPasswordValid = await bcrypt.compare(credentials.password, admin.password);
          
          console.log('🔐 Password valid:', isPasswordValid);
          
          if (!isPasswordValid) {
            console.log('❌ Password comparison failed');
            throw new Error('Invalid credentials');
          }

          console.log('✅ Login successful for:', admin.email);
          
          return {
            id: admin._id.toString(),
            email: admin.email,
            name: admin.name,
            role: admin.role,
          };
        } catch (error) {
          console.error('❌ Auth error:', error);
          throw error;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    }
  },
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
