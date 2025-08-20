import type { NextAuthOptions } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import { compare } from "bcryptjs"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })
        if (!user || !user.passwordHash) return null
        const valid = await compare(credentials.password, user.passwordHash)
        if (!valid) return null
        return { id: user.id, name: user.name ?? "", email: user.email ?? "" }
      }
    })
  ],
  pages: {
    signIn: "/signin"
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token?.sub) {
        ;(session.user as any).id = token.sub
      }
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET
}