import { useEffect, useState } from "react"

// contains...
// conversation list
// open conversation

export default function Conversations() {
    const [convs, setConvs] = useState({});

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/conv`, { credentials: "include" })
            .then((res) => res.json())
            .then((data) => setConvs(data));
    }, []);

    function handleCreateClick() {
        const name = prompt("Enter conversation name:");
        const users = prompt("Enter emails of users (comma separated):").split(",");
        
        fetch(`${import.meta.env.VITE_BACKEND_URL}/conv`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                users
            })
        }).then((res) => res.json()).then((data) => convs.push(data));
    }

    function handleConversationClick() {

    }

    return (
        <div className="conversations">
            <div className="create-conversation">
                <button onClick={handleCreateClick}>Create Conversation</button>
            </div>
            {convs.length > 0 && convs.map((conv) =>
                <div className="conversation" onClick={handleConversationClick} key={conv._id}>
                    {conv.name}
                </div>
            )}
        </div>
    );
}