import { NextAuthConfig } from "next-auth";
import prisma from "../prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";

export default {
    providers: [],
    pages: {
        signIn: `/login`,
        verifyRequest: `/login`,
        error: "/login", // Error code passed in query string as ?error=
    },
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    callbacks: {
        jwt: async ({ token, trigger, session }) => {
            if (trigger === "update") {
                const sessionKeyList = Object.keys(session);
                sessionKeyList.forEach(async (key) => {
                    token[key] = session[key];
                });
            }
            return token;
        },
        signIn: async ({ user, email }) => {
            if (email?.verificationRequest) {
                //if email provider is used and user exists in table, send a magic link
                const userExists = await prisma.user.findUnique({
                    where: {
                        email: user.email || undefined
                    },
                });
                if (userExists) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return true;
            }
        },
    }
} satisfies NextAuthConfig;