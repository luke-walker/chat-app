import dateFormat from "dateformat"
import { useEffect, useState } from "react"
import { io } from "socket.io-client"

import { createConversationPrompt } from "./utils/conversationUtil"
import { retrieveUserByEmail } from "./utils/userUtil"
import "./Conversations.css"

export default function Conversations() {
    const [convs, setConvs] = useState([]);
    const [curConv, setCurConv] = useState(null);
    const [curConvIndex, setCurConvIndex] = useState(-1);
    const [curConvUsers, setCurConvUsers] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const socket = io(import.meta.env.VITE_BACKEND_URL, { withCredentials: true });

        updateConvs();
        socket.on("updateConvs", updateConvs);

        return () => {
            socket.removeAllListeners();
        };
    }, []);

    useEffect(() => {
        if (curConvIndex >= 0) {
            setCurConv(convs[curConvIndex]);
        } else if (convs.length > 0) {
            setCurConvIndex(0);
        }
    }, [convs]);

    useEffect(() => {
        const messagesDiv = document.getElementsByClassName("current-messages")[0];
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
        setMessage("");
        
        async function retrieveUserNames() {
            const userNames = [];
            for (const email of curConv.users) {
                const res = await retrieveUserByEmail(email);
                const user = await res.json();
                userNames.push(user.name);
            }
            setCurConvUsers([...userNames]);
        }
        if (curConv) {
            retrieveUserNames();
        } else {
            setCurConvUsers([]);
        }
    }, [curConv]);

    useEffect(() => {
        if (curConvIndex < 0) {
            setCurConv(null);
        } else if (curConvIndex < convs.length) {
            setCurConv(convs[curConvIndex]);
        }
    }, [curConvIndex]);

    function updateConvs() {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/conv`, { credentials: "include" })
            .then((res) => res.json())
            .then((data) => {
                setConvs(data);
                if (curConvIndex >= data.length) {
                    setCurConvIndex(data.length - 1);
                }
            });
    }

    function handleCreateClick() {
        const [name, users] = createConversationPrompt();
        
        if (name === null || users === null) {
            return;
        }
        
        fetch(`${import.meta.env.VITE_BACKEND_URL}/conv/create`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, users })
        });
        updateConvs();
    }

    async function handleLeaveClick() {
        await fetch(`${import.meta.env.VITE_BACKEND_URL}/conv/leave/${curConv._id.toString()}`, {
            method: "POST",
            credentials: "include"
        });
        updateConvs();
    }

    function handleConversationClick(index) {
        return function() {
            setCurConvIndex(index);
            setCurConv(convs[index]);
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
            body: JSON.stringify({ content: message })
        }).then((res) => {
            if (res.ok) {
                updateConvs();
                setMessage("");
            }
        });
    }

    return (
        <div className="conversations">
            <div className="conversation-list">
                <button className="conversation-create-btn" onClick={handleCreateClick}>Create Conversation</button>
                {convs.length > 0 &&
                    <>
                    {convs.map((conv, index) =>
                        <div className="conversation" onClick={handleConversationClick(index)} key={conv._id}>
                            <p>{conv.name}</p>
                        </div>
                    )}
                    <button className="conversation-leave-btn" onClick={handleLeaveClick}>Leave Conversation</button>
                    </>
                }
            </div>
            <div className="current-conversation">
                <div className="current-messages">
                    {curConv && curConv.messages.map((msg) => 
                        <div className="conversation-message" key={msg._id}>
                            <p>({dateFormat(msg.timestamp, "hh:MM TT, mm/dd/yy")}) {msg.authorName}: {msg.content}</p>
                        </div>
                    )}
                </div>
                {curConvIndex >= 0 &&
                    <div className="conversation-input">
                        <textarea type="text" rows="3" onChange={handleMessageChange} onKeyDown={handleMessageEnter} value={message} placeholder="Enter message..." />
                        <button onClick={sendMessage}>Send</button>
                    </div>
                }
            </div>
            <div className="conversation-users-list">
                {curConvUsers.map((name, index) =>
                    <div className="conversation-user" key={index}>
                        <p>{name}</p>
                    </div>
                )}
            </div>
        </div>
    );
}