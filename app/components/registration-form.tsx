"use client";

import { createUser } from "@/actions"
import { signIn } from "@/auth";
import { useRouter } from 'next/navigation'

export function RegistrationForm({ type }: { type: "login" | "signup" }) {
    const router = useRouter();
    function handleSubmit(formData: FormData) {
        if (type === "signup") {
            createUser({
                email: formData.get("email") as string,
                password: formData.get("password") as string,
                name: formData.get("name") as string ?? undefined
            }).then(() => {
                router.push("/");
            }).catch((error) => {
                alert("User already exists");
            });
        } else {
            signIn("credentials", {
                email: formData.get("email"),
                password: formData.get("password"),
                redirectTo: "/"
            }).catch((error) => {
                alert("Invalid email or password");
            });
        }
    }
    return (
        <form action={handleSubmit}>
            {type === "signup" && <input type="text" placeholder="Name" />}
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <button type="submit">{type === "signup" ? "Sign Up" : "Login"}</button>
        </form>
    )
}