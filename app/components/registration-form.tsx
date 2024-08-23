"use client";

import { createUser } from "@/actions"
import { SessionProvider, signIn } from "next-auth/react";

export function RegistrationForm({ type }: { type: "login" | "signup" }) {
    function handleSubmit(formData: FormData) {
        if (type === "signup") {
            createUser({
                email: formData.get("email") as string,
                password: formData.get("password") as string,
                name: formData.get("name") as string ?? undefined
            }).then(() => {
                login(formData);
            }).catch((error) => {
                alert("User already exists");
            });
        } else {
            login(formData);
        }
    }
    function login(formData: FormData) {
        signIn("credentials", {
            email: formData.get("email"),
            password: formData.get("password"),
            callbackUrl: "/"
        }).catch((error) => {
            alert("Invalid email or password");
        });
    }
    return (
        <SessionProvider>
            <div className="flex items-center justify-center h-screen w-screen">
                <form action={handleSubmit} className="flex flex-col gap-2 items-center justify-center max-w-screen-sm">
                    {type === "signup" && <input className="rounded-md p-2" type="text" placeholder="Name" />}
                    <input className="rounded-md p-2" type="email" placeholder="Email" />
                    <input className="rounded-md p-2" type="password" placeholder="Password" />
                    <button className="border-2 p-2 rounded-md bg-white dark:bg-black" type="submit">{type === "signup" ? "Sign Up" : "Login"}</button>
                </form>
            </div>
        </SessionProvider>
    )
}