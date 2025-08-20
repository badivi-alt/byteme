import NextAuth, { NextAuthOptions } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import { prisma } from "@/lib/prisma"
import { compare } from "bcryptjs"
import { PrismaAdapter } from "@auth/prisma-adapter"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: "database" },
  providers: [
    // Credentials (demo user)
    Credentials({
      name: "Credentials",
      credentials: { email: {}, password: {} },
      async authorize(creds) {
        if (!creds?.email || !creds?.password) return null
        const user = await prisma.user.findUnique({ where: { email: String(creds.email) } })
        if (!user?.passwordHash) return null
        const ok = await compare(String(creds.password), user.passwordHash)
        return ok ? user : null
      }
    }),

    // Google/GitHub auto‑enabled only if env vars exist
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [Google({ clientId: process.env.GOOGLE_CLIENT_ID!, clientSecret: process.env.GOOGLE_CLIENT_SECRET! })]
      : []),
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      ? [GitHub({ clientId: process.env.GITHUB_CLIENT_ID!, clientSecret: process.env.GITHUB_CLIENT_SECRET! })]
      : [])
  ],
  pages: { signIn: "/auth/signin" }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
