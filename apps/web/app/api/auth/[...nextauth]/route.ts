import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
    debug: true,
    providers: [
        CredentialsProvider({
            name: 'Mock Login',
            credentials: {
                username: { label: "Username", type: "text" },
                role: { label: "Role", type: "text" }
            },
            async authorize(credentials) {
                // Return a mock user based on input or default
                const role = credentials?.role || 'Admin';
                const name = credentials?.username || 'Test User';

                return {
                    id: 'mock-user-id',
                    name: name,
                    email: `${name.toLowerCase().replace(' ', '.')}@amex.com`,
                    image: null,
                    role: role // Pass role to be captured in session callback
                };
            }
        })
    ],
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.role = (user as any).role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).role = token.role;
            }
            // Mock permissions based on role
            return session;
        }
    }
});

export { handler as GET, handler as POST };
