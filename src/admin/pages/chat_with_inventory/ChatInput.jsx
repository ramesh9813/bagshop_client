import React, { useState } from 'react';

const ChatInput = ({ 
    handleSend, 
    question, 
    setQuestion, 
    loading, 
    modelsLoading,
    selectedCollection, 
    setSelectedCollection, 
    selectedProvider, 
    handleProviderChange, 
    selectedModel, 
    setSelectedModel,
    collections, 
    providers, 
    filteredModels 
}) => {
    // We use standard Bootstrap dropdown classes, so we don't need manual state for visibility 
    // unless we were building a custom one from scratch. 
    // However, since this is a React component likely without bootstrap.js loaded for interactivity, 
    // we will implement a simple click toggle state.
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = (e) => {
        e.preventDefault();
        setIsOpen(!isOpen);
    };

    // Close dropdown when clicking outside (simple implementation or rely on user clicking toggle)
    // For a cleaner UX in this snippet, we'll just toggle.

    return (
        <div className="bg-white p-2 p-md-3 pt-0">
            <div className="container-fluid" style={{ maxWidth: '950px' }}>
                <form onSubmit={handleSend} className="d-flex align-items-center border rounded-pill shadow-sm bg-white px-2 px-md-3 py-1 gap-1 gap-md-2 position-relative">
                    
                    {/* Bootstrap Dropup for Context */}
                    <div className="dropup position-relative">
                        <button 
                            type="button" 
                            className="btn btn-link text-secondary p-1 border-0"
                            onClick={toggleDropdown}
                            title="Chat Context Settings"
                        >
                            <i className="bi bi-list fs-4"></i>
                        </button>

                        {/* Dropdown Menu */}
                        {isOpen && (
                            <div 
                                className="dropdown-menu show shadow border-0 p-3" 
                                style={{ 
                                    position: 'absolute', 
                                    bottom: '100%', 
                                    left: '0', 
                                    marginBottom: '10px', 
                                    minWidth: '280px',
                                    zIndex: 1050 
                                }}
                            >
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h6 className="dropdown-header p-0 m-0 text-uppercase small fw-bold">Chat Context</h6>
                                    <button type="button" className="btn-close btn-sm" aria-label="Close" onClick={() => setIsOpen(false)}></button>
                                </div>
                                <div className="dropdown-divider"></div>

                                {/* Collection Selector */}
                                <div className="mb-3">
                                    <label className="form-label small text-muted mb-1">Document Source</label>
                                    <select 
                                        className="form-select form-select-sm" 
                                        value={selectedCollection}
                                        onChange={(e) => setSelectedCollection(e.target.value)}
                                        disabled={loading}
                                    >
                                        {collections.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>

                                {/* Provider Selector */}
                                <div className="mb-3">
                                    <label className="form-label small text-muted mb-1">AI Provider</label>
                                    <select 
                                        className="form-select form-select-sm" 
                                        value={selectedProvider}
                                        onChange={handleProviderChange}
                                        disabled={loading || modelsLoading}
                                    >
                                        {providers.map(p => <option key={p} value={p}>{p.toUpperCase()}</option>)}
                                    </select>
                                </div>

                                {/* Model Selector */}
                                <div className="mb-1">
                                    <label className="form-label small text-muted mb-1">Model</label>
                                    <select 
                                        className="form-select form-select-sm" 
                                        value={selectedModel}
                                        onChange={(e) => setSelectedModel(e.target.value)}
                                        disabled={loading || modelsLoading}
                                    >
                                        {filteredModels.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                    </select>
                                </div>
                            </div>
                        )}
                        
                        {/* Overlay to close dropdown when clicking outside */}
                        {isOpen && (
                            <div 
                                style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1040 }} 
                                onClick={() => setIsOpen(false)}
                            ></div>
                        )}
                    </div>

                    {/* Divider */}
                    <div className="vr opacity-25"></div>

                    {/* Text Input */}
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
                        style={{ resize: 'none', minHeight: '24px', maxHeight: '120px', fontSize: '0.9rem' }}
                        onInput={(e) => {
                            e.target.style.height = 'auto';
                            e.target.style.height = e.target.scrollHeight + 'px';
                        }}
                    />

                    <button 
                        className="btn btn-dark rounded-circle flex-shrink-0 d-flex align-items-center justify-content-center p-0" 
                        type="submit" 
                        disabled={loading || !question.trim()}
                        style={{ width: '30px', height: '32px' }}
                    >
                        <i className="bi bi-arrow-up-short fs-4"></i>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatInput;
