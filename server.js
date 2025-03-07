import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        contrasena: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
          });

          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || "Error en la autenticación");
          }

          const user = await res.json();
          if (!user || !user.id || !user.email) {
            throw new Error("Usuario no válido");
          }

          return user;
        } catch (error) {
          console.error("Error en login:", error.message);
          throw new Error(error.message || "Error en el servidor");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días en segundos
    updateAge: 24 * 60 * 60,   // Refrescar cada 24 horas
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      
      if (!token.exp) {
        token.exp = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
      }

      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
  },
  pages: {
    signIn: "/login", // Página de login personalizada
    error: "/login", // Redirige a login si hay error
  },
});