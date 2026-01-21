import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  debug: true, // Enable debug messages in the console
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub;
      return session;
    },
    async signIn({ account, profile }) {
      console.log("SignIn Attempt:", {
        provider: account?.provider,
        email: profile?.email,
        hasClientId: !!process.env.GOOGLE_CLIENT_ID,
        hasSecret: !!process.env.NEXTAUTH_SECRET
      });
      return true;
    },
  },
  pages: {
    signIn: '/',
    error: '/',
  },
});

export { handler as GET, handler as POST };
