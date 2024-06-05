import Conversations from "./Conversations"
import { useEffect, useState } from "react"

import "./App.css"

export default function App() {
    const [auth, setAuth] = useState(false);

    async function logout() {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/logout`, { credentials: "include" });
        setAuth(!res.ok);
    }

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
        await logout();
    }

    return (
        <div className="app">
            {auth ?
                <div className="content-container">
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