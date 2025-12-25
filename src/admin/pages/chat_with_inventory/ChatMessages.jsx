import React from 'react';
import MessageContent from './MessageContent';

const ChatMessages = ({ chatHistory, loading, chatEndRef }) => {
    return (
        <div className="flex-grow-1 overflow-auto p-3 p-md-4" style={{ backgroundColor: '#ffffff' }}>
            <div className="container-fluid" style={{ maxWidth: '850px' }}>
                {chatHistory.length === 0 && (
                    <div className="text-center text-muted mt-5 pt-5 opacity-50">
                        <i className="bi bi-robot fs-1 mb-3 d-block"></i>
                        <h5>AI Analysis Ready</h5>
                        <p className="small">Ask me anything about your BagShop data.</p>
                    </div>
                )}

                {chatHistory.map((msg, i) => (
                    <div key={i} className={`d-flex mb-4 ${msg.type === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                        <div 
                            className={`p-3 rounded-4 px-3 px-md-4 ${msg.type === 'user' ? 'bg-light border' : 'bg-white border-0'}`}
                            style={{ maxWidth: '90%' }}
                        >
                            {msg.type === 'bot' && (
                                <div className="d-flex align-items-center mb-2 text-primary">
                                    <i className="bi bi-stars me-2"></i>
                                    <span className="fw-bold small" style={{letterSpacing: '0.5px'}}>{msg.modelName || 'AI'}</span>
                                </div>
                            )}
                            <div className="chat-text-content" style={{ fontSize: '0.95rem' }}>
                                <MessageContent text={msg.text} />
                            </div>
                        </div>
                    </div>
                ))}
                
                {loading && (
                    <div className="d-flex mb-4 justify-content-start">
                        <div className="p-3 text-muted small">
                            <span className="spinner-border spinner-border-sm text-warning me-2" role="status"></span>
                            AI is thinking...
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>
        </div>
    );
};

export default ChatMessages;
