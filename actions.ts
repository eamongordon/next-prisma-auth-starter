"use server";

import { hash } from "bcrypt";
import prisma from "./prisma";
import { auth } from "./auth";

export const editUser = async (
    key: string,
    value: string
) => {
    const session = await auth();
    if (!session || !session.user) {
        throw new Error("Not authenticated")
    }
    let savedValue;
    try {
        if (key === 'password') {
            savedValue = await hash(value, 10);
        } else {
            savedValue = value;
        }
        const response = await prisma.user.update({
            where: {
                id: session.user.id,
            },
            data: {
                [key]: value,
            },
        });
        return response;
    } catch (error: any) {
        if (error.code === "P2002") {
            return {
                error: `This ${key} is already in use`,
            };
        } else {
            return {
                error: error.message,
            };
        }
    }
};

export const createUser = async (userdata: { email: string; password: string; name?: string }) => {
    const { email, password, name } = userdata;

    try {
        const exists = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (exists) {
            throw new Error("User already exists");
        } else {
            const user = await prisma.user.create({
                data: {
                    email,
                    password: await hash(password, 10),
                    name,
                },
            });
            return user;
        }
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};

export const deleteUser = async () => {
    try {
        const session = await auth();
        if (!session || !session.user) {
            throw new Error("Not authenticated");
        } else {
            const response = await prisma.user.delete({
                where: {
                    id: session.user.id,
                },
            });
            return response;
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};
