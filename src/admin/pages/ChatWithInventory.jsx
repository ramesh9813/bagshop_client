import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'

const ChatWithInventory = () => {
    const [question, setQuestion] = useState('')
    const [selectedProvider, setSelectedProvider] = useState('openai')
    const [selectedModel, setSelectedModel] = useState('openai/gpt-3.5-turbo')
    const [selectedCollection, setSelectedCollection] = useState('Products')
    const [availableModels, setAvailableModels] = useState([])
    const [providers, setProviders] = useState([])
    const [chatHistory, setChatHistory] = useState([
        { type: 'bot', text: 'Hello Owner! I am your store AI assistant powered by OpenRouter. Choose a Data Source, Provider, and Model above to start deep-diving into your business!', modelName: 'Assistant' }
    ])
    const [loading, setLoading] = useState(false)
    const [modelsLoading, setModelsLoading] = useState(true)
    const chatEndRef = useRef(null)

    const collections = ['Products', 'Orders', 'Users', 'Inquiries'];

    useEffect(() => {
        const fetchModels = async () => {
            try {
                const { data } = await axios.get('https://openrouter.ai/api/v1/models');
                const fetchedModels = data.data;
                
                // Extract unique providers from model IDs (e.g., 'openai/gpt-4' -> 'openai')
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
        fetchModels();
    }, []);

    // Filter models based on selected provider
    const filteredModels = availableModels.filter(m => m.id.startsWith(`${selectedProvider}/`))
        .sort((a, b) => a.name.localeCompare(b.name));

    const handleProviderChange = (e) => {
        const newProvider = e.target.value;
        setSelectedProvider(newProvider);
        
        // Auto-select the first model of the new provider
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

    const handleSend = async (e) => {
        e.preventDefault()
        if (!question.trim()) return

        const userMsg = question
        const currentModelId = selectedModel
        const currentModelName = availableModels.find(m => m.id === currentModelId)?.name || 'AI'
        const currentCollection = selectedCollection;

        setQuestion('')
        setChatHistory(prev => [...prev, { type: 'user', text: userMsg }])
        setLoading(true)

        try {
            const { data } = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/admin/ask-gpt`,
                { 
                    question: userMsg, 
                    model: currentModelId,
                    collection: currentCollection 
                },
                { withCredentials: true }
            )
            if (data.success) {
                setChatHistory(prev => [...prev, { 
                    type: 'bot', 
                    text: data.answer, 
                    modelName: `${currentModelName} (${currentCollection} Analysis)` 
                }])
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Sorry, I am having trouble connecting to the brain right now.'
            setChatHistory(prev => [...prev, { type: 'bot', text: errorMsg, modelName: 'System' }])
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container-fluid h-100" style={{ minHeight: 'calc(100vh - 150px)' }}>
            <div className="card shadow-sm border-0 h-100 d-flex flex-column">
                <div className="card-header bg-white py-3 border-bottom d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center flex-wrap gap-2">
                        <h5 className="mb-0 fw-bold me-2"><i className="bi bi-robot me-2 text-primary"></i>Store AI</h5>
                        
                        {/* Collection Dropdown */}
                        <select 
                            className="form-select form-select-sm w-auto border-primary" 
                            value={selectedCollection}
                            onChange={(e) => setSelectedCollection(e.target.value)}
                            disabled={loading}
                            title="Choose Data Source"
                        >
                            {collections.map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>

                        {/* Provider Dropdown */}
                        <select 
                            className="form-select form-select-sm w-auto" 
                            value={selectedProvider}
                            onChange={handleProviderChange}
                            disabled={loading || modelsLoading}
                        >
                            {modelsLoading ? (
                                <option>Loading...</option>
                            ) : (
                                providers.map(p => (
                                    <option key={p} value={p}>{p.toUpperCase()}</option>
                                ))
                            )}
                        </select>

                        {/* Model Dropdown */}
                        <select 
                            className="form-select form-select-sm w-auto" 
                            value={selectedModel}
                            onChange={(e) => setSelectedModel(e.target.value)}
                            disabled={loading || modelsLoading}
                        >
                            {modelsLoading ? (
                                <option>Loading models...</option>
                            ) : (
                                filteredModels.map(m => (
                                    <option key={m.id} value={m.id}>{m.name}</option>
                                ))
                            )}
                        </select>
                    </div>
                    <span className="badge bg-success d-none d-md-inline">OpenRouter Ready</span>
                </div>
                
                <div className="card-body overflow-auto flex-grow-1" style={{ maxHeight: '500px', backgroundColor: '#f8f9fa' }}>
                    {chatHistory.map((msg, i) => (
                        <div key={i} className={`d-flex mb-3 ${msg.type === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                            <div 
                                className={`p-3 rounded-3 shadow-sm ${msg.type === 'user' ? 'bg-secondary text-white' : 'bg-white text-dark'}`}
                                style={{ maxWidth: '75%', position: 'relative' }}
                            >
                                <div className="d-flex justify-content-between align-items-center mb-1 border-bottom pb-1" style={{ fontSize: '0.7rem', opacity: 0.8 }}>
                                    <span className="fw-bold">{msg.type === 'user' ? 'Owner' : 'BagShop AI'}</span>
                                    {!msg.type === 'user' || msg.modelName ? (
                                        <span className="ms-3 badge bg-light text-dark border">{msg.modelName}</span>
                                    ) : null}
                                </div>
                                <div>{msg.text}</div>
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="d-flex mb-3 justify-content-start">
                            <div className="bg-white p-3 rounded-3 shadow-sm text-muted">
                                <span className="spinner-grow spinner-grow-sm me-2"></span> AI is analyzing inventory...
                            </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                <div className="card-footer bg-white border-top py-3">
                    <form onSubmit={handleSend} className="input-group">
                        <input 
                            type="text" 
                            className="form-control form-control-lg border-0 bg-light" 
                            placeholder="Ask about inventory, stock, or trends..."
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            disabled={loading}
                        />
                        <button className="btn btn-dark px-4" type="submit" disabled={loading || !question.trim()}>
                            <i className="bi bi-send-fill"></i>
                        </button>
                    </form>
                    <div className="text-muted small mt-2 text-center">
                        Example: "What is my most expensive product?", "Show me low stock items", "How many categories do we have?"
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatWithInventory
