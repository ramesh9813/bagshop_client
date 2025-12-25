import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import ChatSidebar from './chat_with_inventory/ChatSidebar'
import ChatMessages from './chat_with_inventory/ChatMessages'
import ChatInput from './chat_with_inventory/ChatInput'
import './chat_with_inventory/chatwithinventory.css'

const ChatWithInventory = () => {
    const [question, setQuestion] = useState('')
    const [selectedProvider, setSelectedProvider] = useState('google')
    const [selectedModel, setSelectedModel] = useState('google/gemini-2.0-flash-lite-preview-02-05:free')
    const [selectedCollection, setSelectedCollection] = useState('Products')
    
    const [availableModels, setAvailableModels] = useState([])
    const [providers, setProviders] = useState([])
    
    // Session State
    const [sessions, setSessions] = useState([])
    const [currentSessionId, setCurrentSessionId] = useState(null)
    const [chatHistory, setChatHistory] = useState([])
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    
    const [loading, setLoading] = useState(false)
    const [modelsLoading, setModelsLoading] = useState(true)
    const chatEndRef = useRef(null)

    const collections = ['Products', 'Orders', 'Users', 'Inquiries'];

    // 1. Fetch Sessions and Models on Mount
    useEffect(() => {
        fetchSessions();
        fetchModels();
    }, []);

    const fetchSessions = async () => {
        try {
            const { data } = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/admin/chat/sessions`,
                { withCredentials: true }
            );
            if (data.success) {
                setSessions(data.sessions);
                // If sessions exist and none selected, select the most recent one
                if (data.sessions.length > 0 && !currentSessionId) {
                    selectSession(data.sessions[0]._id);
                } else if (data.sessions.length === 0) {
                    createNewSession();
                }
            }
        } catch (error) {
            console.error("Failed to fetch sessions", error);
        }
    };

    const fetchModels = async () => {
        try {
            const { data } = await axios.get('https://openrouter.ai/api/v1/models');
            const fetchedModels = data.data;
            const providerList = [...new Set(fetchedModels.map(m => m.id.split('/')[0]))].sort();
            
            setProviders(providerList);
            setAvailableModels(fetchedModels);
                    } catch (error) {
                        console.error("Failed to fetch models", error);
                        setProviders(['google', 'meta', 'openai']);
                        setAvailableModels([
                            { name: 'Gemini 2.0 Flash Lite (Free)', id: 'google/gemini-2.0-flash-lite-preview-02-05:free' },
                            { name: 'Llama 3 8B (Free)', id: 'meta-llama/llama-3-8b-instruct:free' },
                            { name: 'GPT-3.5 Turbo', id: 'openai/gpt-3.5-turbo' }
                        ]);
                    } finally {            setModelsLoading(false);
        }
    };

    const selectSession = async (id) => {
        try {
            setLoading(true);
            const { data } = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/admin/chat/session/${id}`,
                { withCredentials: true }
            );
            if (data.success) {
                setChatHistory(data.chat.messages || []);
                setCurrentSessionId(data.chat._id);
                if (data.chat.settings) {
                    setSelectedProvider(data.chat.settings.provider || 'openai');
                    setSelectedModel(data.chat.settings.model || 'openai/gpt-3.5-turbo');
                    setSelectedCollection(data.chat.settings.collectionName || 'Products');
                }
                // Collapse sidebar on selection
                setIsSidebarOpen(false);
            }
        } catch (error) {
            toast.error("Failed to load chat session");
        } finally {
            setLoading(false);
        }
    };

    const createNewSession = async () => {
        try {
            setLoading(true);
            const { data } = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/admin/chat/session/new`,
                {},
                { withCredentials: true }
            );
            if (data.success) {
                setChatHistory(data.chat.messages || []);
                setCurrentSessionId(data.chat._id);
                if (data.chat.settings) {
                    setSelectedProvider(data.chat.settings.provider || 'openai');
                    setSelectedModel(data.chat.settings.model || 'openai/gpt-3.5-turbo');
                    setSelectedCollection(data.chat.settings.collectionName || 'Products');
                }
                setIsSidebarOpen(false); 
                toast.success("New chat started");
                fetchSessions(); // Refresh list in background
            }
        } catch (error) {
            toast.error("Failed to create new session");
        } finally {
            setLoading(false);
        }
    };

    const deleteSession = async (e, id) => {
        e.stopPropagation(); // Prevent selecting the session when clicking delete
        if(window.confirm("Are you sure you want to delete this chat?")) {
            try {
                await axios.delete(
                    `${import.meta.env.VITE_API_BASE_URL}/admin/chat/session/${id}`,
                    { withCredentials: true }
                );
                
                // If deleted current session, select another or create new
                if (id === currentSessionId) {
                    const remaining = sessions.filter(s => s._id !== id);
                    if (remaining.length > 0) {
                        selectSession(remaining[0]._id);
                    } else {
                        createNewSession();
                    }
                } else {
                    // Just refresh list
                    fetchSessions();
                }
            } catch (error) {
                toast.error("Failed to delete session");
            }
        }
    };

    // Filter models based on selected provider
    const filteredModels = availableModels.filter(m => m.id.startsWith(`${selectedProvider}/`))
        .sort((a, b) => a.name.localeCompare(b.name));

    const handleProviderChange = (e) => {
        const newProvider = e.target.value;
        setSelectedProvider(newProvider);
        
        const firstModel = availableModels.find(m => m.id.startsWith(`${newProvider}/`));
        if (firstModel) {
            setSelectedModel(firstModel.id);
        }
    };

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [chatHistory])

    // Helper to save to DB
    const saveToDb = async (msgObj, titleUpdate = null) => {
        if (!currentSessionId) return;

        try {
            await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/admin/chat/save`,
                { 
                    sessionId: currentSessionId,
                    message: msgObj,
                    settings: {
                        provider: selectedProvider,
                        model: selectedModel,
                        collectionName: selectedCollection
                    },
                    title: titleUpdate // Optional title update
                },
                { withCredentials: true }
            );
        } catch (error) {
            console.error("Failed to save chat to DB", error);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault()
        if (!question.trim()) return

        const userMsgText = question
        const currentModelId = selectedModel
        const currentModelName = availableModels.find(m => m.id === currentModelId)?.name || 'AI'
        const currentCollection = selectedCollection;

        setQuestion('')
        
        const userMsgObj = { type: 'user', text: userMsgText };
        setChatHistory(prev => [...prev, userMsgObj])
        setLoading(true)

        // Generate a title if it's the first user message in a new chat (heuristic)
        let newTitle = null;
        if (chatHistory.length <= 1) { // 1 because of initial bot greeting
            newTitle = userMsgText.length > 30 ? userMsgText.substring(0, 30) + "..." : userMsgText;
            // Update local session title immediately for UI
             setSessions(prev => prev.map(s => s._id === currentSessionId ? { ...s, title: newTitle } : s));
        }

        // Save User Message
        saveToDb(userMsgObj, newTitle);

        try {
            const { data } = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/admin/ask-gpt`,
                { 
                    question: userMsgText, 
                    model: currentModelId,
                    collection: currentCollection 
                },
                { withCredentials: true }
            )
            
            if (data.success) {
                const botMsgObj = { 
                    type: 'bot', 
                    text: data.answer, 
                    modelName: `${currentModelName} (${currentCollection} Analysis)` 
                };

                setChatHistory(prev => [...prev, botMsgObj]);
                saveToDb(botMsgObj);
            }
        } catch (error) {
            const errorText = error.response?.data?.message || 'Sorry, I am having trouble connecting to the brain right now.';
            const errorMsgObj = { type: 'bot', text: errorText, modelName: 'System' };
            setChatHistory(prev => [...prev, errorMsgObj]);
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="d-flex h-100 w-100 position-relative" style={{ height: 'calc(100vh - 100px)' }}> 
            <div className="d-flex flex-column h-100 w-100 bg-white overflow-hidden position-relative">
                
                {/* Sidebar - Overlay for History */}
                <ChatSidebar 
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                    createNewSession={createNewSession}
                    sessions={sessions}
                    currentSessionId={currentSessionId}
                    selectSession={selectSession}
                    deleteSession={deleteSession}
                />

                {/* Main Chat Area */}
                <div className="d-flex flex-column flex-grow-1 h-100 position-relative overflow-hidden" style={{ height: '100%' }}>
                    
                    {/* Minimal Header */}
                    <div className="d-flex align-items-center justify-content-between px-3 py-2 border-bottom bg-white flex-shrink-0" style={{ height: '50px', zIndex: 10 }}>
                        <div className="d-flex align-items-center">
                            <button className="btn btn-sm btn-link text-dark p-0 me-3" onClick={() => setIsSidebarOpen(!isSidebarOpen)} title="History">
                                <i className="bi bi-clock-history fs-5"></i>
                            </button>
                            <span className="small text-muted d-none d-md-inline">
                                {sessions.find(s => s._id === currentSessionId)?.title || 'New Session'}
                            </span>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <div className="d-flex align-items-center text-success bg-success bg-opacity-10 px-2 py-1 rounded-pill" style={{ fontSize: '0.7rem' }}>
                                <i className="bi bi-circle-fill me-2" style={{fontSize: '0.4rem'}}></i>
                                <span className="fw-bold" style={{letterSpacing: '0.5px'}}>ONLINE</span>
                            </div>
                        </div>
                    </div>

                    {/* Chat Messages Area with padding for the fixed footer */}
                    <div className="flex-grow-1 overflow-auto bg-white" style={{ marginBottom: '85px' }}>
                        <ChatMessages 
                            chatHistory={chatHistory}
                            loading={loading}
                            chatEndRef={chatEndRef}
                        />
                    </div>

                    {/* Input Area - Fixed at bottom of Main Chat Area */}
                    <div className="fixed bottom-0 left-0 w-full z-50 bg-white border-t p-4" style={{ zIndex: 20 }}>
                        <ChatInput 
                            handleSend={handleSend}
                            question={question}
                            setQuestion={setQuestion}
                            loading={loading}
                            modelsLoading={modelsLoading}
                            selectedCollection={selectedCollection}
                            setSelectedCollection={setSelectedCollection}
                            selectedProvider={selectedProvider}
                            handleProviderChange={handleProviderChange}
                            selectedModel={selectedModel}
                            setSelectedModel={setSelectedModel}
                            collections={collections}
                            providers={providers}
                            filteredModels={filteredModels}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatWithInventory