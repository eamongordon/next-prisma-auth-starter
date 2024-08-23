"use client";

import { editUser } from "@/actions";

export default function EditUserForm({ type, property, label }: { type: string, property: string, label: string }) {
    function handleSubmit(formData: FormData) {
        const formDataValue = formData.get(property) as string;
        editUser(property, formDataValue).then(() => {
            alert("Changes saved");
        }).catch((error) => {
            alert(error);
        });
    }
    return (
        <div className="flex items-center justify-center h-72">
            <form action={handleSubmit} className="flex flex-col gap-2 items-center justify-center max-w-screen-sm">
                <p>{label}</p>
                <input className="rounded-md p-2" type={type} placeholder={label} />
                <button className="border-2 p-2 rounded-md bg-white dark:bg-black" type="submit">Save Changes</button>
            </form>
        </div>
    )
}