import { useAuth } from "../context/AuthContext";

export default function LogOutButton() {

    const { logout } = useAuth();

    return (
        <button onClick={logout}>
            Logout
        </button>
    );
}