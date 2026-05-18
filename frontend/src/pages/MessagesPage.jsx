import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { useDispatch, useSelector } from 'react-redux';
import { Loader2, Send, User, MessageSquare } from 'lucide-react';
import { setUnreadCount } from '../redux/messageSlice';

const MessagesPage = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth);
    const [searchParams, setSearchParams] = useSearchParams();
    const activeUserId = searchParams.get('user');

    const [contacts, setContacts] = useState([]);
    const [activeContact, setActiveContact] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loadingContacts, setLoadingContacts] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Fetch contacts
    const fetchContacts = async () => {
        try {
            const res = await api.get('/message/contacts');
            if (res.data.success) {
                setContacts(res.data.contacts);
                // Update global unread count
                const totalUnread = res.data.contacts.reduce((acc, contact) => acc + (contact.unread || 0), 0);
                dispatch(setUnreadCount(totalUnread));
            }
        } catch (error) {
            console.error("Failed to fetch contacts", error);
        } finally {
            setLoadingContacts(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    // Fetch messages for active contact
    const fetchMessages = async (userId) => {
        try {
            const res = await api.get(`/message/conversation/${userId}`);
            if (res.data.success) {
                setMessages(res.data.messages);
            }
        } catch (error) {
            console.error("Failed to fetch messages", error);
        }
    };

    useEffect(() => {
        if (activeUserId) {
            setLoadingMessages(true);
            fetchMessages(activeUserId).finally(() => setLoadingMessages(false));
            
            // Find and set active contact details from contacts list if available
            const contact = contacts.find(c => c.user._id === activeUserId);
            if (contact) {
                setActiveContact(contact.user);
            } else if (!activeContact) {
                // If not in contacts, we might need a separate endpoint to fetch basic user info
                // For MVP, we'll just set the ID and show 'Unknown User'
                setActiveContact({ _id: activeUserId, fullname: 'Chat' });
            }
        } else {
            setMessages([]);
            setActiveContact(null);
        }
    }, [activeUserId, contacts]);

    // Polling for new messages
    useEffect(() => {
        if (!activeUserId) return;
        const interval = setInterval(() => {
            fetchMessages(activeUserId);
            fetchContacts(); // Update unread counts in sidebar
        }, 5000);
        return () => clearInterval(interval);
    }, [activeUserId]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeUserId) return;

        const text = newMessage;
        setNewMessage(""); // optimistic clear

        // Optimistically add message
        setMessages(prev => [...prev, {
            _id: Date.now().toString(),
            sender: user._id,
            receiver: activeUserId,
            text,
            createdAt: new Date().toISOString()
        }]);

        try {
            const res = await api.post(`/message/send/${activeUserId}`, { text });
            if (res.data.success) {
                fetchContacts(); // refresh last message
            }
        } catch (error) {
            console.error(error);
            setNewMessage(text); // revert on failure
        }
    };

    const handleContactClick = (contactUser) => {
        setSearchParams({ user: contactUser._id });
    };

    return (
        <div className="max-w-6xl mx-auto px-4 pt-28 pb-10 relative z-10 text-gray-900 dark:text-white h-[calc(100vh-10px)] flex flex-col">
            <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-2xl flex-1 flex overflow-hidden shadow-lg">
                
                {/* Sidebar (Contacts) */}
                <div className={`${activeUserId ? 'hidden md:flex' : 'flex'} w-full md:w-80 flex-col border-r border-gray-200 dark:border-white/10`}>
                    <div className="p-4 border-b border-gray-200 dark:border-white/10">
                        <h2 className="text-xl font-bold">Messages</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {loadingContacts ? (
                            <div className="flex justify-center p-8"><Loader2 className="animate-spin w-6 h-6 text-blue-500" /></div>
                        ) : contacts.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">No conversations yet.</div>
                        ) : (
                            contacts.map(c => (
                                <div 
                                    key={c.user._id} 
                                    onClick={() => handleContactClick(c.user)}
                                    className={`p-4 border-b border-gray-50 dark:border-white/5 cursor-pointer flex gap-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${activeUserId === c.user._id ? 'bg-blue-50 dark:bg-blue-500/10' : ''}`}
                                >
                                    <div className="relative">
                                        <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center font-bold text-blue-600 dark:text-blue-300 overflow-hidden">
                                            {c.user.profile?.profilePhoto ? (
                                                <img src={c.user.profile.profilePhoto} alt="profile" className="h-full w-full object-cover" />
                                            ) : (
                                                <User className="h-6 w-6" />
                                            )}
                                        </div>
                                        {c.unread > 0 && activeUserId !== c.user._id && (
                                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-white dark:border-[#1a1a1a]">
                                                {c.unread}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center mb-1">
                                            <h3 className="font-semibold truncate">{c.user.fullname}</h3>
                                            <span className="text-xs text-gray-400">{new Date(c.timestamp).toLocaleDateString()}</span>
                                        </div>
                                        <p className={`text-sm truncate ${c.unread > 0 && activeUserId !== c.user._id ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-500 dark:text-slate-400'}`}>
                                            {c.lastMessage}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                <div className={`${!activeUserId ? 'hidden md:flex md:items-center md:justify-center' : 'flex'} flex-1 flex-col bg-slate-50 dark:bg-[#121212]`}>
                    {!activeUserId ? (
                        <div className="text-center text-gray-400 dark:text-slate-500 flex flex-col items-center">
                            <MessageSquare className="w-16 h-16 mb-4 opacity-50" />
                            <p>Select a conversation to start messaging</p>
                        </div>
                    ) : (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 bg-white dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-white/10 flex items-center gap-3 shadow-sm">
                                <button 
                                    className="md:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                                    onClick={() => setSearchParams({})}
                                >
                                    ←
                                </button>
                                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center font-bold text-blue-600 dark:text-blue-300 overflow-hidden">
                                    {activeContact?.profile?.profilePhoto ? (
                                        <img src={activeContact.profile.profilePhoto} alt="profile" className="h-full w-full object-cover" />
                                    ) : (
                                        <User className="h-5 w-5" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold">{activeContact?.fullname || 'Loading...'}</h3>
                                    {/* Subtitle could be job title context if we pass it */}
                                </div>
                            </div>

                            {/* Messages Container */}
                            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                                {loadingMessages ? (
                                    <div className="flex justify-center p-8"><Loader2 className="animate-spin w-6 h-6 text-blue-500" /></div>
                                ) : messages.length === 0 ? (
                                    <div className="flex-1 flex items-center justify-center text-gray-400">
                                        No messages yet. Send a message to start the conversation!
                                    </div>
                                ) : (
                                    messages.map((msg, i) => {
                                        const isMe = msg.sender === user?._id;
                                        return (
                                            <div key={msg._id || i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-[70%] px-4 py-2 rounded-2xl ${isMe ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-200 dark:bg-white/10 text-gray-900 dark:text-white rounded-bl-none'}`}>
                                                    <p>{msg.text}</p>
                                                    <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-blue-200' : 'text-gray-500'}`}>
                                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Message Input */}
                            <div className="p-4 bg-white dark:bg-[#1a1a1a] border-t border-gray-200 dark:border-white/10">
                                <form onSubmit={handleSendMessage} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type your message..."
                                        className="flex-1 bg-gray-100 dark:bg-white/5 border border-transparent dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                    />
                                    <button 
                                        type="submit" 
                                        disabled={!newMessage.trim()}
                                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5 py-3 transition-colors disabled:opacity-50 flex items-center justify-center"
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </form>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessagesPage;
