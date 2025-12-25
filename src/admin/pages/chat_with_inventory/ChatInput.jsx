import React from 'react';

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
    return (
        <div className="bg-white p-2 p-md-3 pt-0">
            <div className="container-fluid" style={{ maxWidth: '950px' }}>
                <form onSubmit={handleSend} className="d-flex align-items-center border rounded-pill shadow-sm bg-white px-2 px-md-3 py-1 gap-1 gap-md-2">
                    
                    {/* Selectors (Hidden on very small screens, otherwise compact) */}
                    <div className="d-none d-md-flex align-items-center gap-1 border-end pe-2">
                        <select 
                            className="form-select form-select-sm border-0 bg-transparent fw-bold text-primary shadow-none p-0" 
                            value={selectedCollection}
                            onChange={(e) => setSelectedCollection(e.target.value)}
                            disabled={loading}
                            style={{ width: 'auto', cursor: 'pointer', fontSize: '0.75rem' }}
                        >
                            {collections.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>

                        <span className="text-muted opacity-25 d-none d-lg-inline">|</span>

                        <select 
                            className="form-select form-select-sm border-0 bg-transparent text-muted shadow-none p-0 d-none d-lg-inline" 
                            value={selectedProvider}
                            onChange={handleProviderChange}
                            disabled={loading || modelsLoading}
                            style={{ width: 'auto', cursor: 'pointer', fontSize: '0.75rem', maxWidth: '70px' }}
                        >
                            {providers.map(p => <option key={p} value={p}>{p.toUpperCase()}</option>)}
                        </select>

                        <span className="text-muted opacity-25 d-none d-md-inline">|</span>

                        <select 
                            className="form-select form-select-sm border-0 bg-transparent text-muted shadow-none p-0 d-none d-md-inline" 
                            value={selectedModel}
                            onChange={(e) => setSelectedModel(e.target.value)}
                            disabled={loading || modelsLoading}
                            style={{ width: 'auto', cursor: 'pointer', fontSize: '0.7rem', maxWidth: '100px' }}
                        >
                            {filteredModels.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                        </select>
                    </div>

                    {/* Text Input */}
                    <textarea 
                        className="form-control border-0 shadow-none bg-transparent py-2" 
                        placeholder={`Message...`}
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
