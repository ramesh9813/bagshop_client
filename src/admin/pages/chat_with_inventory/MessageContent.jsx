import React from 'react';

const MessageContent = ({ text }) => {
    if (!text) return null;

    // Helper to process inline formatting (bold, italic)
    const processInline = (str) => {
        // Bold: **text**
        const parts = str.split(/(\**.*?\**)/g);
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
                    return <div key={i} className="d-flex align-items-start mb-1"><span className="me-2 fw-bold">{i}.</span><span>{processInline(item.text)}</span></div>;
                } else {
                    return <p key={i} className="mb-2">{processInline(item.text)}</p>;
                }
            })}
        </div>
    );
};

export default MessageContent;
