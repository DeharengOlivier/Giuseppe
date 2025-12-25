import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { prisma } from "@/lib/prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google,
  ],
  callbacks: {
    async signIn({ user }) {
      const allowedEmails = ["deharengolivier@gmail.com", "gbalzano1@gmail.com"]
      return allowedEmails.includes(user.email || "")
    },
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login", // Rediriger vers login en cas d'erreur (ex: email non autorisé)
  },
  session: {
    strategy: "jwt",
  },
})
