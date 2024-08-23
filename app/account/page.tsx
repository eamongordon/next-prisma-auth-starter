import EditUserForm  from "../components/edit-user-form";
import DeleteUserButton from "../components/delete-user-button";

export default function Page() {
    return (
        <div className="flex flex-col justify-center items-center">
            <h1>Account</h1>
            <EditUserForm type="text" property="email" label="Email" />
            <EditUserForm type="text" property="name" label="Name" />
            <EditUserForm type="password" property="password" label="New Password" />
            <DeleteUserButton/>
        </div>
    )
}
