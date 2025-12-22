import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    // Generate page numbers to display
    // We want to show a window of pages, e.g., current page +/- 1 or 2
    // For simplicity and adhering to the "1,2,3,4" request, we'll map all if small, or a range if large.
    // Given the request style "1,2,3,,4,next, last , first", I will implement a standard robust pagination.
    
    let pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    // Handlers
    const handleFirst = () => onPageChange(1);
    const handleLast = () => onPageChange(totalPages);
    const handleNext = () => onPageChange(Math.min(currentPage + 1, totalPages));
    const handlePrev = () => onPageChange(Math.max(currentPage - 1, 1));

    return (
        <nav aria-label="Page navigation" className="mt-4 d-flex justify-content-center">
            <ul className="pagination">
                {/* First Button */}
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button 
                        className="page-link btn-outline-warning text-dark" 
                        onClick={handleFirst}
                        style={{ borderColor: '#ffc107' }}
                    >
                        First
                    </button>
                </li>

                {/* Previous Button (implied by typical flow, though user didn't explicitly list 'prev' in the specific string, usually expected with Next) */}
                {/* User asked for: 1,2,3,,4,next, last , first. I'll add Prev for good UX. */}
                 <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button 
                        className="page-link btn-outline-warning text-dark" 
                        onClick={handlePrev}
                        style={{ borderColor: '#ffc107' }}
                    >
                        Prev
                    </button>
                </li>

                {/* Page Numbers */}
                {pageNumbers.map(number => {
                     // Simple logic: Show all if pages < 10, otherwise could implement ellipsis logic. 
                     // For this project, I'll show all or a simple window around current.
                     // To keep it simple and robust per request:
                     
                     return (
                        <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                            <button 
                                onClick={() => onPageChange(number)}
                                className={`page-link ${currentPage === number ? 'bg-warning text-dark border-warning' : 'btn-outline-warning text-dark'}`}
                                style={{ borderColor: '#ffc107' }}
                            >
                                {number}
                            </button>
                        </li>
                     );
                })}

                {/* Next Button */}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button 
                        className="page-link btn-outline-warning text-dark" 
                        onClick={handleNext}
                        style={{ borderColor: '#ffc107' }}
                    >
                        Next
                    </button>
                </li>

                {/* Last Button */}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button 
                        className="page-link btn-outline-warning text-dark" 
                        onClick={handleLast}
                        style={{ borderColor: '#ffc107' }}
                    >
                        Last
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;
