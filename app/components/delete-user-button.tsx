"use client";

import { deleteUser } from "@/actions";
import { signOut } from "next-auth/react";

export default function DeleteUserButton() {
    return (
        <button className="bg-red-500 text-white p-2 rounded-md" onClick={() => deleteUser().then(() => {
            signOut({ callbackUrl: "/" });
        })}>
            Delete Account
        </button>
    )
}