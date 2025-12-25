import React, { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';

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
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = (e) => {
        e.preventDefault();
        setIsOpen(!isOpen);
    };

    return (
        <div className="bg-white p-2 p-md-3 pt-0">
            <style>
                {`
                    .custom-context-menu .dropdown-item:hover, 
                    .custom-context-menu .dropdown-item:focus,
                    .custom-context-menu .dropdown-item:active,
                    .custom-context-menu .dropdown-item.active {
                        background-color: #ffc107 !important;
                        color: black !important;
                    }
                    .custom-context-menu .dropdown-toggle::after {
                        float: right;
                        margin-top: 10px;
                    }
                    .custom-context-menu .btn-close:focus {
                        box-shadow: 0 0 0 0.25rem rgba(255, 193, 7, 0.25) !important;
                    }
                `}
            </style>
            <div className="container-fluid" style={{ maxWidth: '950px' }}>
                <form onSubmit={handleSend} className="d-flex align-items-center border rounded-pill shadow-sm bg-white px-2 px-md-3 py-1 gap-1 gap-md-2 position-relative">
                    
                    {/* Bootstrap Dropup for Context */}
                    <div className="dropup position-relative">
                        <button 
                            type="button" 
                            className="btn btn-link text-secondary p-1 border-0 shadow-none"
                            onClick={toggleDropdown}
                            title="Chat Context Settings"
                        >
                            <i className="bi bi-list fs-4"></i>
                        </button>

                        {/* Dropdown Menu */}
                        {isOpen && (
                            <div 
                                className="dropdown-menu show shadow border-0 p-3 custom-context-menu" 
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
                                    <Dropdown onSelect={(val) => setSelectedCollection(val)} drop="up">
                                        <Dropdown.Toggle variant="white" className="w-100 text-start border btn-sm shadow-none">
                                            {selectedCollection}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu className="w-100 shadow-sm border-0" style={{ zIndex: 1100 }}>
                                            {collections.map(c => (
                                                <Dropdown.Item key={c} eventKey={c} active={selectedCollection === c}>
                                                    {c}
                                                </Dropdown.Item>
                                            ))}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>

                                {/* Provider Selector */}
                                <div className="mb-3">
                                    <label className="form-label small text-muted mb-1">AI Provider</label>
                                    <Dropdown onSelect={(val) => handleProviderChange({ target: { value: val } })} drop="up">
                                        <Dropdown.Toggle variant="white" className="w-100 text-start border btn-sm shadow-none">
                                            {selectedProvider.toUpperCase()}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu className="w-100 shadow-sm border-0" style={{ zIndex: 1100 }}>
                                            {providers.map(p => (
                                                <Dropdown.Item key={p} eventKey={p} active={selectedProvider === p}>
                                                    {p.toUpperCase()}
                                                </Dropdown.Item>
                                            ))}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>

                                {/* Model Selector */}
                                <div className="mb-1">
                                    <label className="form-label small text-muted mb-1">Model</label>
                                    <Dropdown onSelect={(val) => setSelectedModel(val)} drop="up">
                                        <Dropdown.Toggle variant="white" className="w-100 text-start border btn-sm shadow-none">
                                            {filteredModels.find(m => m.id === selectedModel)?.name || 'Select Model'}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu className="w-100 shadow-sm border-0" style={{ maxHeight: '250px', overflowY: 'auto', zIndex: 1100 }}>
                                            {filteredModels.map(m => (
                                                <Dropdown.Item key={m.id} eventKey={m.id} active={selectedModel === m.id}>
                                                    {m.name}
                                                </Dropdown.Item>
                                            ))}
                                        </Dropdown.Menu>
                                    </Dropdown>
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
