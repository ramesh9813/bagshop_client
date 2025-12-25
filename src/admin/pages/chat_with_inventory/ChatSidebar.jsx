import React from 'react';

const ChatSidebar = ({ isSidebarOpen, setIsSidebarOpen, createNewSession, sessions, currentSessionId, selectSession, deleteSession }) => {
    return (
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
                <h6 className="m-0 fw-bold small">HISTORY</h6>
                <button className="btn btn-sm p-0" onClick={() => setIsSidebarOpen(false)}>
                    <i className="bi bi-x-lg"></i>
                </button>
            </div>
            <div className="p-2">
                <button className="btn btn-warning btn-sm w-100 mb-2 rounded-pill" onClick={createNewSession}>
                    <i className="bi bi-plus-lg me-1"></i> New Chat
                </button>
            </div>
            <div className="flex-grow-1 overflow-auto">
                <ul className="list-group list-group-flush">
                    {sessions.map(session => (
                        <li 
                            key={session._id} 
                            className={`list-group-item list-group-item-action border-0 py-2 d-flex justify-content-between align-items-center ${currentSessionId === session._id ? 'bg-primary bg-opacity-10 fw-bold' : ''}`}
                            onClick={() => selectSession(session._id)}
                            style={{ cursor: 'pointer', borderRadius: '8px', margin: '2px 8px', fontSize: '0.85rem' }}
                        >
                            <div className="text-truncate" style={{ maxWidth: '160px' }}>
                                <div className="text-truncate">{session.title}</div>
                            </div>
                            <button 
                                className="btn btn-sm text-danger p-0 opacity-50" 
                                onClick={(e) => deleteSession(e, session._id)}
                            >
                                <i className="bi bi-trash"></i>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ChatSidebar;
