import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

const handler = NextAuth({
  // Adapter
  adapter: PrismaAdapter(prisma),

  // Provedores de login (poderia ter GitHub, Facebook, etc aqui também)
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  // Ativa logs detalhados no terminal durante o desenvolvimento
  debug: process.env.NODE_ENV === "development",
});

// Export na mesma função para GET e POST, pois o NextAuth precisa de ambos
export { handler as GET, handler as POST };
