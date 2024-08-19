import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import Nodemailer from "next-auth/providers/nodemailer";
import prisma from "./prisma";
import { compare } from "bcrypt";
import { PrismaAdapter } from "@auth/prisma-adapter";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        CredentialsProvider({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const { email, password } = credentials ?? {}
                if (!email || !password) {
                    throw new Error("Missing email or password");
                }
                const user = await prisma.user.findUnique({
                    where: {
                        email: email as string,
                    },
                });
                // if user doesn't exist or password doesn't match
                if (!user || !user.password || !(await compare(password as string, user.password))) {
                    throw new Error("Invalid email or password")
                }
                return user;
            },
        }),
        Nodemailer({
            server: {
                host: process.env.EMAIL_SERVER_HOST,
                port: parseInt(process.env.EMAIL_SERVER_PORT as string),
                auth: {
                    user: process.env.EMAIL_SERVER_USER,
                    pass: process.env.EMAIL_SERVER_PASSWORD
                }
            },
            from: process.env.EMAIL_FROM
        })
    ],
    pages: {
        signIn: `/login`,
        verifyRequest: `/login`,
        error: "/login", // Error code passed in query string as ?error=
    },
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    callbacks: {
        jwt: async ({ token, user, trigger, session }) => {
            if (trigger === "update") {
                const sessionKeyList = Object.keys(session);
                sessionKeyList.forEach(async (key) => {
                    token[key] = session[key];
                    //@ts-expect-error;
                    if (token?.user && token?.user[key]) {
                        if (key !== 'password') {
                            //@ts-expect-error;
                            token.user[key] = session[key];
                        }
                    }
                });
            }
            return token;
        },
        signIn: async ({ user, profile }) => {
            if (!profile) {
                const userExists = await prisma.user.findUnique({
                    where: {
                        email: user.email || undefined
                    },
                });
                if (userExists) {
                    return true;   //if the email exists in the User collection, email them a magic login link
                } else {
                    return false;
                }
            } else {
                return true;
            }
        },
    }
})