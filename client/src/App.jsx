import Conversations from "./Conversations"
import { useEffect, useState } from "react"

export default function App() {
    const [auth, setAuth] = useState(false);

    useEffect(() => {
        async function authorizeUser() {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth`, { credentials: "include" });
            setAuth(res.ok);
        }
        authorizeUser();
    }, [auth]);

    function handleLoginClick() {
        window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/google`;
    }

    async function handleLogoutClick() {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/logout`, { credentials: "include" });
        setAuth(!res.ok);
    }

    return (
        <div className="app">
            {auth ?
                <div>
                    <button className="logout-button" onClick={handleLogoutClick}>Logout</button>
                    <Conversations />
                </div>
            :
                <div className="login-container">
                    <button className="login-button" onClick={handleLoginClick}>Login with Google</button>
                </div>    
            }
        </div>
    );
}