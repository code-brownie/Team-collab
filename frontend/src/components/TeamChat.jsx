/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef, useContext } from 'react';
import { useSocket } from "@/context/SocketContext";
import { AuthContext } from "@/context/AuthContext";
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Loader2 } from 'lucide-react';

const TeamChat = ({ teamId }) => {
    const { socket, isConnected } = useSocket();
    const { userId } = useContext(AuthContext);
    const [username, setUserName] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState({});
    const [typingTimeout, setTypingTimeout] = useState(null);
    const messagesEndRef = useRef(null);
    const chatContentRef = useRef(null);
const URL =
    import.meta.env.VITE_NODE_ENV === 'production'
        ? import.meta.env.VITE_API_BASE_URL_PROD 
        : import.meta.env.VITE_API_BASE_URL_DEV;    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const getUser = async () => {
        try {
            const response = await fetch(`${URL}/users/getUserById?id=${userId.id}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const data = await response.json();
            if (response.ok) {
                setUserName(data.user.name);
            }
        } catch (error) {
            console.log('error', error);
        }
    };

    useEffect(() => {
        if (userId && userId.id) {
            getUser();
        }
    }, [userId])

    useEffect(() => {
        const loadMessages = async () => {
            try {
                const response = await fetch(`${URL}/messages/team/${teamId}`);
                const data = await response.json();
                setMessages(data.messages);
            } catch (error) {
                console.error('Error loading messages:', error);
            }
        };

        if (teamId) {
            loadMessages();
        }
    }, [teamId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Adjust height on window resize
    useEffect(() => {
        const adjustHeight = () => {
            if (chatContentRef.current) {
                const viewportHeight = window.innerHeight;
                const headerHeight = 65;
                const inputHeight = 81;
                const contentHeight = viewportHeight - headerHeight - inputHeight;
                chatContentRef.current.style.height = `${contentHeight}px`;
            }
        };

        adjustHeight();
        window.addEventListener('resize', adjustHeight);
        return () => window.removeEventListener('resize', adjustHeight);
    }, []);

    useEffect(() => {
        if (!socket) return;

        socket.on('newMessage', ({ message }) => {
            setMessages(prev => [...prev, message]);
            setIsTyping(prev => ({
                ...prev,
                [message.senderId]: false
            }));
        });

        socket.on('userTyping', ({ userId: typingUserId }) => {
            setIsTyping(prev => ({
                ...prev,
                [typingUserId]: true
            }));

            setTimeout(() => {
                setIsTyping(prev => ({
                    ...prev,
                    [typingUserId]: false
                }));
            }, 2000);
        });

        return () => {
            socket.off('newMessage');
            socket.off('userTyping');
        };
    }, [socket]);

    const handleTyping = () => {
        if (typingTimeout) clearTimeout(typingTimeout);

        socket.emit('typing', {
            teamId: teamId,
            userId: userId.id,
            userName: username
        });

        const timeout = setTimeout(() => {
            setTypingTimeout(null);
        }, 1000);

        setTypingTimeout(timeout);
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !isConnected) return;

        socket.emit('sendMessage', {
            teamId: teamId,
            message: newMessage.trim(),
            senderId: userId.id,
            senderName: username
        });

        setNewMessage('');
    };

    const formatMessageDate = (timestamp) => {
        const messageDate = new Date(timestamp);
        const now = new Date();
        const diffInHours = (now - messageDate) / (1000 * 60 * 60);
        const diffInDays = Math.floor(diffInHours / 24);

        // If message is from today, show time
        if (diffInDays === 0) {
            return messageDate.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
        }
        // If message is from yesterday, show "Yesterday" and time
        else if (diffInDays === 1) {
            return `Yesterday at ${messageDate.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            })}`;
        }
        // If message is from this week (within 7 days), show day name and time
        else if (diffInDays < 7) {
            return messageDate.toLocaleDateString('en-US', {
                weekday: 'long',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
        }
        // Otherwise show full date
        else {
            return messageDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
        }
    };

    const shouldShowDateSeparator = (currentMsg, prevMsg) => {
        if (!prevMsg) return true;

        const currentDate = new Date(currentMsg.timestamp).toLocaleDateString();
        const prevDate = new Date(prevMsg.timestamp).toLocaleDateString();

        return currentDate !== prevDate;
    };

    const formatDateSeparator = (timestamp) => {
        const messageDate = new Date(timestamp);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (messageDate.toLocaleDateString() === today.toLocaleDateString()) {
            return 'Today';
        } else if (messageDate.toLocaleDateString() === yesterday.toLocaleDateString()) {
            return 'Yesterday';
        } else {
            return messageDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
    };

    return (
        <div className="h-screen flex flex-col">
            <Card className="flex-1 flex flex-col rounded-none border-x-0">
                <CardHeader className="border-b px-4 py-4 md:px-6">
                    <h2 className="text-xl font-semibold">Team Chat</h2>
                </CardHeader>

                <CardContent
                    ref={chatContentRef}
                    className="flex-1 overflow-y-auto p-4 space-y-4 md:px-6"
                >
                    {messages.map((msg, index) => (
                        <React.Fragment key={msg.id}>
                            {shouldShowDateSeparator(msg, messages[index - 1]) && (
                                <div className="flex items-center justify-center my-4">
                                    <div className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full">
                                        {formatDateSeparator(msg.timestamp)}
                                    </div>
                                </div>
                            )}
                            <div
                                className={`flex ${msg.senderId === userId.id ? 'justify-end' : 'justify-start'
                                    }`}
                            >
                                <div
                                    className={`max-w-[85%] md:max-w-[70%] rounded-lg p-3 ${msg.senderId === userId.id
                                        ? 'bg-gray-800 text-white'
                                        : 'bg-gray-100'
                                        }`}
                                >
                                    <div className="text-sm font-medium mb-1">
                                        {msg.senderId === userId.id ? 'You' : msg.senderName}
                                    </div>
                                    <div className="break-words">{msg.content}</div>
                                    <div className={`text-xs ${msg.senderId === userId.id
                                        ? 'text-blue-100'
                                        : 'text-gray-500'
                                        } mt-1`}>
                                        {formatMessageDate(msg.timestamp)}
                                    </div>
                                </div>
                            </div>
                        </React.Fragment>
                    ))}

                    {Object.entries(isTyping).map(([typingUserId, isTyping]) => (
                        isTyping && typingUserId !== userId.id && (
                            <div key={typingUserId} className="text-sm text-gray-500 italic">
                                Someone is typing...
                            </div>
                        )
                    ))}

                    <div ref={messagesEndRef} />
                </CardContent>

                <form
                    onSubmit={handleSendMessage}
                    className="border-t p-4 flex gap-2 md:px-6"
                >
                    <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleTyping}
                        placeholder="Type a message..."
                        className="flex-1"
                    />
                    <Button
                        type="submit"
                        disabled={!isConnected || !newMessage.trim()}
                    >
                        {isConnected ? <Send className="h-5 w-5" /> : <Loader2 className="h-5 w-5 animate-spin" />}
                    </Button>
                </form>
            </Card>
        </div>
    );
};

export default TeamChat;