import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'

const ChatWithInventory = () => {
    const [question, setQuestion] = useState('')
    const [selectedModel, setSelectedModel] = useState('openai/gpt-3.5-turbo')
    const [chatHistory, setChatHistory] = useState([
        { type: 'bot', text: 'Hello Owner! I am your store AI assistant powered by OpenRouter. Choose a model and ask me about your products!' }
    ])
    const [loading, setLoading] = useState(false)
    const chatEndRef = useRef(null)

    const models = [
        { name: 'GPT-3.5 Turbo', id: 'openai/gpt-3.5-turbo' },
        { name: 'GPT-4o', id: 'openai/gpt-4o' },
        { name: 'Claude 3 Opus', id: 'anthropic/claude-3-opus' },
        { name: 'Claude 3.5 Sonnet', id: 'anthropic/claude-3.5-sonnet' },
        { name: 'Gemini Pro 1.5', id: 'google/gemini-pro-1.5' },
        { name: 'Mistral Large', id: 'mistralai/mistral-large' },
        { name: 'Meta Llama 3 70B', id: 'meta-llama/llama-3-70b-instruct' }
    ]

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
        setQuestion('')
        setChatHistory(prev => [...prev, { type: 'user', text: userMsg }])
        setLoading(true)

        try {
            const { data } = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/admin/ask-gpt`,
                { question: userMsg, model: selectedModel },
                { withCredentials: true }
            )
            if (data.success) {
                setChatHistory(prev => [...prev, { type: 'bot', text: data.answer }])
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Sorry, I am having trouble connecting to the brain right now.'
            setChatHistory(prev => [...prev, { type: 'bot', text: errorMsg }])
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container-fluid h-100" style={{ minHeight: 'calc(100vh - 150px)' }}>
            <div className="card shadow-sm border-0 h-100 d-flex flex-column">
                <div className="card-header bg-white py-3 border-bottom d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                        <h5 className="mb-0 fw-bold me-3"><i className="bi bi-robot me-2 text-primary"></i>Store AI Insight</h5>
                        <select 
                            className="form-select form-select-sm w-auto" 
                            value={selectedModel}
                            onChange={(e) => setSelectedModel(e.target.value)}
                            disabled={loading}
                        >
                            {models.map(m => (
                                <option key={m.id} value={m.id}>{m.name}</option>
                            ))}
                        </select>
                    </div>
                    <span className="badge bg-success">OpenRouter Active</span>
                </div>
                
                <div className="card-body overflow-auto flex-grow-1" style={{ maxHeight: '500px', backgroundColor: '#f8f9fa' }}>
                    {chatHistory.map((msg, i) => (
                        <div key={i} className={`d-flex mb-3 ${msg.type === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                            <div 
                                className={`p-3 rounded-3 shadow-sm ${msg.type === 'user' ? 'bg-primary text-white' : 'bg-white text-dark'}`}
                                style={{ maxWidth: '75%', position: 'relative' }}
                            >
                                <div className="small fw-bold mb-1">{msg.type === 'user' ? 'Owner' : 'BagShop AI'}</div>
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
                        <button className="btn btn-primary px-4" type="submit" disabled={loading || !question.trim()}>
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
