import { useEffect, useState } from "react"
import { io } from "socket.io-client"

export default function Conversations() {
    const [convs, setConvs] = useState([]);
    const [curConv, setCurConv] = useState(null);
    const [curConvIndex, setCurConvIndex] = useState(-1);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const socket = io(import.meta.env.VITE_BACKEND_URL, {
            withCredentials: true
        });

        socket.on("updateConvs", updateConvs);

        updateConvs();

        return () => {
            socket.removeAllListeners();
        };
    }, []);

    useEffect(() => {
        if (curConvIndex >= 0) {
            setCurConv(convs[curConvIndex]);
        } else if (convs.length > 0) {
            setCurConv(convs[0]);
        }
    }, [convs]);

    useEffect(() => {
        setMessage("");
    }, [curConv]);

    useEffect(() => {
        setCurConv(convs[curConvIndex]);
    }, [curConvIndex]);

    function updateConvs() {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/conv`, { credentials: "include" })
            .then((res) => res.json())
            .then((data) => setConvs(data));
    }

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

    function handleConversationClick(index) {
        return function() {
            setCurConvIndex(index);
            setCurConv(convs[index])
        }
    }

    function handleMessageChange(e) {
        setMessage(e.target.value);
    }

    function handleMessageEnter(e) {
        if (e.key === "Enter") {
            sendMessage();
        }
    }

    function sendMessage() {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/conv/${curConv._id}`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                content: message
            })
        }).then((res) => {
            if (res.ok) {
                updateConvs();
                setMessage("");
            }
        });
    }

    return (
        <div className="conversations">
            <div className="create-conversation">
                <button onClick={handleCreateClick}>Create Conversation</button>
            </div>
            <div className="conversation-list">
                {convs.length > 0 && convs.map((conv, index) =>
                    <div className="conversation" onClick={handleConversationClick(index)} key={index}>
                        {conv.name}
                    </div>
                )}
            </div>
            <div className="current-conversation">
                {curConv && curConv.messages.map((msg) => 
                    <div className="conversation-message" key={msg._id}>
                        <p>{msg.author}: {msg.content}</p>
                    </div>
                )}
                <input type="text" onChange={handleMessageChange} onKeyDown={handleMessageEnter} value={message} placeholder="Enter message..." />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
}
