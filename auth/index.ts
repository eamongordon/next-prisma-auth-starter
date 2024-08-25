import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import Nodemailer from "next-auth/providers/nodemailer";
import prisma from "../prisma";
import { compare } from "bcrypt";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "./config";

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
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
    ]
})