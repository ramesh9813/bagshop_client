import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
 
// Custom Markdown-like Renderer Component
const MessageContent = ({ text }) => {
    if (!text) return null;

    // Helper to process inline formatting (bold, italic)
    const processInline = (str) => {
        // Bold: **text**
        const parts = str.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i}>{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    // 1. Check for Code Blocks (```)
    if (text.includes('```')) {
        const parts = text.split(/```/g);
        return (
            <div>
                {parts.map((part, i) => {
                    if (i % 2 === 1) { // Code block
                        return (
                            <pre key={i} className="bg-dark text-light p-3 rounded mt-2 mb-2 overflow-auto" style={{fontSize: '0.9rem'}}>
                                <code>{part.trim()}</code>
                            </pre>
                        );
                    } else { // Normal text
                        return <div key={i}>{part.split('\n').map((line, j) => <p key={j} className="mb-1">{processInline(line)}</p>)}</div>;
                    }
                })}
            </div>
        );
    }

    // 2. Check for Tables (rows starting with |)
    const lines = text.split('\n');
    let inTable = false;
    let tableRows = [];
    let content = [];

    lines.forEach((line, index) => {
        if (line.trim().startsWith('|')) {
            inTable = true;
            tableRows.push(line);
        } else {
            if (inTable) {
                // Flush table
                content.push({ type: 'table', rows: tableRows });
                tableRows = [];
                inTable = false;
            }
            if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
                 content.push({ type: 'ul', text: line.substring(2) });
            } else if (/^\d+\.\s/.test(line.trim())) {
                 content.push({ type: 'ol', text: line.replace(/^\d+\.\s/, '') });
            } else if (line.trim() !== '') {
                 content.push({ type: 'p', text: line });
            }
        }
    });
    // Flush remaining table if ends with table
    if (inTable) content.push({ type: 'table', rows: tableRows });

    return (
        <div>
            {content.map((item, i) => {
                if (item.type === 'table') {
                    const headers = item.rows[0].split('|').filter(c => c.trim() !== '').map(c => c.trim());
                    const bodyRows = item.rows.slice(2).map(row => row.split('|').filter(c => c.trim() !== '').map(c => c.trim())); // Skip separator row
                    
                    return (
                        <div key={i} className="table-responsive mb-3">
                            <table className="table table-bordered table-sm table-hover bg-white mb-0">
                                <thead className="table-light">
                                    <tr>
                                        {headers.map((h, k) => <th key={k}>{h}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {bodyRows.map((row, k) => (
                                        <tr key={k}>
                                            {row.map((cell, l) => <td key={l}>{processInline(cell)}</td>)}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    );
                } else if (item.type === 'ul') {
                    return <div key={i} className="d-flex align-items-start mb-1"><i className="bi bi-dot me-2"></i><span>{processInline(item.text)}</span></div>;
                } else if (item.type === 'ol') {
                    return <div key={i} className="d-flex align-items-start mb-1"><span className="me-2 fw-bold">{i}.</span><span>{processInline(item.text)}</span></div>; // Simplified numbering
                } else {
                    return <p key={i} className="mb-2">{processInline(item.text)}</p>;
                }
            })}
        </div>
    );
};

const ChatWithInventory = () => {
    // ... (rest of the component logic remains unchanged until render)
    const [question, setQuestion] = useState('')
    const [selectedProvider, setSelectedProvider] = useState('openai')
    const [selectedModel, setSelectedModel] = useState('openai/gpt-3.5-turbo')
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
            setProviders(['openai', 'google', 'anthropic']);
            setAvailableModels([
                { name: 'GPT-3.5 Turbo', id: 'openai/gpt-3.5-turbo' },
                { name: 'GPT-4o', id: 'openai/gpt-4o' }
            ]);
        } finally {
            setModelsLoading(false);
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
            <div className="d-flex flex-column h-100 w-100 bg-white rounded shadow-sm overflow-hidden border position-relative">
                
                {/* Sidebar - Overlay for History */}
                <div 
                    className={`bg-light border-end d-flex flex-column transition-all`}
                    style={{ 
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: isSidebarOpen ? '260px' : '0px', 
                        zIndex: 100, // Reduced z-index to stay inside the component context
                        transition: 'width 0.3s ease',
                        overflow: 'hidden',
                        backgroundColor: '#f8f9fa'
                    }}
                >
                    <div className="p-3 border-bottom d-flex justify-content-between align-items-center bg-white">
                        <h6 className="m-0 fw-bold">Chat History</h6>
                        <button className="btn btn-sm btn-ghost" onClick={() => setIsSidebarOpen(false)}>
                            <i className="bi bi-x-lg"></i>
                        </button>
                    </div>
                    <div className="p-2">
                        <button className="btn btn-primary w-100 mb-2 rounded-pill" onClick={createNewSession}>
                            <i className="bi bi-plus-lg me-2"></i> New Chat
                        </button>
                    </div>
                    <div className="flex-grow-1 overflow-auto">
                        <ul className="list-group list-group-flush">
                            {sessions.map(session => (
                                <li 
                                    key={session._id} 
                                    className={`list-group-item list-group-item-action border-0 py-2 d-flex justify-content-between align-items-center ${currentSessionId === session._id ? 'bg-light fw-bold' : ''}`}
                                    onClick={() => selectSession(session._id)}
                                    style={{ cursor: 'pointer', borderRadius: '8px', margin: '0 8px' }}
                                >
                                    <div className="text-truncate" style={{ maxWidth: '180px' }}>
                                        <div className="text-truncate">{session.title}</div>
                                        <div className="small text-muted" style={{fontSize: '0.75rem'}}>{new Date(session.updatedAt || session.createdAt).toLocaleDateString()}</div>
                                    </div>
                                    <button 
                                        className="btn btn-sm text-danger opacity-50 hover-opacity-100" 
                                        onClick={(e) => deleteSession(e, session._id)}
                                        title="Delete Chat"
                                    >
                                        <i className="bi bi-trash"></i>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Main Chat Area */}
                <div className="d-flex flex-column flex-grow-1 h-100" style={{ marginLeft: isSidebarOpen ? '280px' : '0', transition: 'margin-left 0.3s' }}>
                    
                    {/* Minimal Header with Toggle */}
                    <div className="d-flex align-items-center justify-content-between px-3 py-2 border-bottom bg-white">
                        <div className="d-flex align-items-center">
                            <button className="btn btn-sm btn-link text-dark p-0 me-2" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                                <i className={`bi ${isSidebarOpen ? 'bi-layout-sidebar-inset' : 'bi-layout-sidebar'}`}></i>
                            </button>
                            <h6 className="mb-0 fw-bold">AI Inventory Assistant</h6>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <span className="badge bg-success bg-opacity-10 text-success rounded-pill" style={{ fontSize: '0.7rem' }}>
                                <i className="bi bi-circle-fill me-1" style={{fontSize: '0.4rem'}}></i>Online
                            </span>
                        </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-grow-1 overflow-auto p-4" style={{ backgroundColor: '#ffffff' }}>
                        <div className="container" style={{ maxWidth: '900px' }}>
                            {chatHistory.length === 0 && (
                                <div className="text-center text-muted mt-5 pt-5 opacity-50">
                                    <i className="bi bi-robot fs-1 mb-3 d-block"></i>
                                    <h4>What can I analyze for you today?</h4>
                                    <p className="small">Ask about your stock, orders, or user trends.</p>
                                </div>
                            )}

                            {chatHistory.map((msg, i) => (
                                <div key={i} className={`d-flex mb-4 ${msg.type === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                                    <div 
                                        className={`p-3 rounded-4 px-4 ${msg.type === 'user' ? 'bg-light border' : 'bg-white border-0'}`}
                                        style={{ 
                                            maxWidth: '85%',
                                            boxShadow: msg.type === 'bot' ? 'none' : 'none'
                                        }}
                                    >
                                        {msg.type === 'bot' && (
                                            <div className="d-flex align-items-center mb-2 text-primary">
                                                <i className="bi bi-stars me-2"></i>
                                                <span className="fw-bold small" style={{letterSpacing: '0.5px'}}>{msg.modelName || 'AI'}</span>
                                            </div>
                                        )}
                                        <div className="chat-text-content">
                                            <MessageContent text={msg.text} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            {loading && (
                                <div className="d-flex mb-4 justify-content-start">
                                    <div className="p-3 text-muted small">
                                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                        AI is thinking...
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>
                    </div>

                    {/* Input Area (Bottom) - Redesigned Single Row */}
                    <div className="bg-white p-3 pt-0">
                        <div className="container" style={{ maxWidth: '1000px' }}>
                            <form onSubmit={handleSend} className="d-flex align-items-center border rounded-pill shadow-sm bg-white px-3 py-1 gap-2">
                                
                                {/* Unified Selector Row (Left) */}
                                <div className="d-none d-lg-flex align-items-center gap-1 border-end pe-2">
                                    <select 
                                        className="form-select form-select-sm border-0 bg-transparent fw-bold text-primary shadow-none p-0" 
                                        value={selectedCollection}
                                        onChange={(e) => setSelectedCollection(e.target.value)}
                                        disabled={loading}
                                        style={{ width: 'auto', cursor: 'pointer', fontSize: '0.75rem' }}
                                    >
                                        {collections.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>

                                    <span className="text-muted opacity-25">|</span>

                                    <select 
                                        className="form-select form-select-sm border-0 bg-transparent text-muted shadow-none p-0" 
                                        value={selectedProvider}
                                        onChange={handleProviderChange}
                                        disabled={loading || modelsLoading}
                                        style={{ width: 'auto', cursor: 'pointer', fontSize: '0.75rem', maxWidth: '80px' }}
                                    >
                                        {providers.map(p => <option key={p} value={p}>{p.toUpperCase()}</option>)}
                                    </select>

                                    <span className="text-muted opacity-25">|</span>

                                    <select 
                                        className="form-select form-select-sm border-0 bg-transparent text-muted shadow-none p-0" 
                                        value={selectedModel}
                                        onChange={(e) => setSelectedModel(e.target.value)}
                                        disabled={loading || modelsLoading}
                                        style={{ width: 'auto', cursor: 'pointer', fontSize: '0.75rem', maxWidth: '120px' }}
                                    >
                                        {filteredModels.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                    </select>
                                </div>

                                {/* Text Input (Center) */}
                                <textarea 
                                    className="form-control border-0 shadow-none bg-transparent py-2" 
                                    placeholder={`Message AI about ${selectedCollection}...`}
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSend(e);
                                        }
                                    }}
                                    disabled={loading}
                                    rows="1"
                                    style={{ resize: 'none', minHeight: '24px', maxHeight: '150px', fontSize: '0.9rem' }}
                                    onInput={(e) => {
                                        e.target.style.height = 'auto';
                                        e.target.style.height = e.target.scrollHeight + 'px';
                                    }}
                                />

                                {/* Send Button (Right) */}
                                <button 
                                    className="btn btn-dark rounded-circle flex-shrink-0 d-flex align-items-center justify-content-center p-0" 
                                    type="submit" 
                                    disabled={loading || !question.trim()}
                                    style={{ width: '32px', height: '32px' }}
                                >
                                    <i className="bi bi-arrow-up-short fs-4"></i>
                                </button>
                            </form>
                            <div className="text-center mt-1">
                                <small className="text-muted opacity-50" style={{ fontSize: '0.6rem' }}>
                                    AI-generated content may be inaccurate.
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatWithInventory
