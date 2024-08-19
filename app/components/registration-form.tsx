import { createUser } from "@/actions"

export function RegistrationForm({ type }: { type: "login" | "signup" }) {
    function handleSubmit() {
       if (type === "signup") {
        // createUser({ email: "test", password: "test", name: "test" })
       } else {
        // signIn({ email: "test", password: "test" })
       }
    }   
    return (
        <div>
            {type === "signup" && <input type="text" placeholder="Name" />}
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <button onClick={handleSubmit}>{type === "signup" ? "Sign Up" : "Login"}</button>
        </div>
    )
}