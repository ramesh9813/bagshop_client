import React, { useState, useEffect } from 'react';

const ShortcutOverlay = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Alt') {
                e.preventDefault(); // Prevent default browser menu focus if possible
                setIsVisible(true);
            }
        };

        const handleKeyUp = (e) => {
            if (e.key === 'Alt') {
                setIsVisible(false);
            }
        };

        const handleBlur = () => {
            setIsVisible(false);
        };

        const handleFocus = () => {
            setIsVisible(false);
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        window.addEventListener('blur', handleBlur);
        window.addEventListener('focus', handleFocus);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('blur', handleBlur);
            window.removeEventListener('focus', handleFocus);
        };
    }, []);

    if (!isVisible) return null;

    const shortcuts = [
        { key: 'H', description: 'Go to Homepage' },
        { key: 'P', description: 'Browse Products' },
        { key: 'F', description: 'Toggle Filters (Product Page)' },
        { key: '/', description: 'Focus Search Bar' },
        { key: 'C', description: 'View Cart / Clear Filters (on Product Page)' },
        { key: 'S', description: 'View My Orders' },
        { key: 'Alt', description: 'Hold to View Shortcuts' },
    ];

    return (
        <div 
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(8px)',
                zIndex: 10000,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white',
                animation: 'fadeIn 0.2s ease-in-out'
            }}
        >
            <div className="container text-center">
                <h2 className="mb-5 fw-bold text-warning display-5">Keyboard Shortcuts</h2>
                <div className="row justify-content-center g-4">
                    {shortcuts.map((shortcut, index) => (
                        <div key={index} className="col-md-4 col-sm-6">
                            <div 
                                className="p-4 rounded border border-secondary"
                                style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    transition: 'transform 0.2s'
                                }}
                            >
                                <div 
                                    className="d-inline-block bg-white text-dark fw-bold rounded px-3 py-2 mb-3 shadow"
                                    style={{ fontSize: '1.5rem', minWidth: '60px' }}
                                >
                                    {shortcut.key}
                                </div>
                                <h4 className="fw-light">{shortcut.description}</h4>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-5 text-white-50">
                    Release <span className="badge bg-secondary border border-light">Alt</span> to close
                </div>
            </div>
            <style>
                {`
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                `}
            </style>
        </div>
    );
};

export default ShortcutOverlay;
