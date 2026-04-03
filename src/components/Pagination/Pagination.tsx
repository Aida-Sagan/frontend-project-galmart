import React from 'react';
import './styles/Pagination.css';

export const usePagination = ({ totalPages, siblingCount = 1, currentPage }) => {
    const paginationRange = React.useMemo(() => {
        const totalPageNumbers = siblingCount + 5;
        if (totalPageNumbers >= totalPages) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }
        const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
        const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);
        const shouldShowLeftDots = leftSiblingIndex > 2;
        const shouldShowRightDots = rightSiblingIndex < totalPages - 2;
        const firstPageIndex = 1;
        const lastPageIndex = totalPages;
        if (!shouldShowLeftDots && shouldShowRightDots) {
            let leftItemCount = 3 + 2 * siblingCount;
            let leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
            return [...leftRange, '...', totalPages];
        }
        if (shouldShowLeftDots && !shouldShowRightDots) {
            let rightItemCount = 3 + 2 * siblingCount;
            let rightRange = Array.from({ length: rightItemCount }, (_, i) => totalPages - rightItemCount + i + 1);
            return [firstPageIndex, '...', ...rightRange];
        }
        if (shouldShowLeftDots && shouldShowRightDots) {
            let middleRange = Array.from({ length: rightSiblingIndex - leftSiblingIndex + 1 }, (_, i) => leftSiblingIndex + i);
            return [firstPageIndex, '...', ...middleRange, '...', lastPageIndex];
        }
    }, [totalPages, siblingCount, currentPage]);
    return paginationRange || [];
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const paginationRange = usePagination({ currentPage, totalPages });

    if (totalPages <= 1 || paginationRange.length < 1) {
        return null;
    }

    const onNext = () => {
        onPageChange(currentPage + 1);
    };

    const onPrevious = () => {
        onPageChange(currentPage - 1);
    };

    return (
        <nav className="pagination">
            <button
                className="pagination__arrow"
                onClick={onPrevious}
                disabled={currentPage === 1}
                aria-label="Previous Page"
            >
                {/* СТРЕЛКА ВЛЕВО */}
                <svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M9.11872 0.381282C9.46043 0.72299 9.46043 1.27701 9.11872 1.61872L2.73744 8L9.11872 14.3813C9.46043 14.723 9.46043 15.277 9.11872 15.6187C8.77701 15.9604 8.22299 15.9604 7.88128 15.6187L0.881282 8.61872C0.539573 8.27701 0.539573 7.72299 0.881282 7.38128L7.88128 0.381282C8.22299 0.0395728 8.77701 0.0395728 9.11872 0.381282Z" fill="currentColor"/>
                </svg>
            </button>
            {paginationRange.map((pageNumber, index) => {
                if (pageNumber === '...') {
                    return <span key={`dots-${index}`} className="pagination__dots">&#8230;</span>;
                }

                return (
                    <button
                        key={pageNumber}
                        className={`pagination__button ${currentPage === pageNumber ? 'active' : ''}`}
                        onClick={() => onPageChange(pageNumber)}
                    >
                        {pageNumber}
                    </button>
                );
            })}
            <button
                className="pagination__arrow"
                onClick={onNext}
                disabled={currentPage === totalPages}
                aria-label="Next Page"
            >
                {/* СТРЕЛКА ВПРАВО */}
                <svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M0.881282 0.381282C0.539574 0.72299 0.539574 1.27701 0.881282 1.61872L7.26256 8L0.881282 14.3813C0.539574 14.723 0.539574 15.277 0.881282 15.6187C1.22299 15.9604 1.77701 15.9604 2.11872 15.6187L9.11872 8.61872C9.46043 8.27701 9.46043 7.72299 9.11872 7.38128L2.11872 0.381282C1.77701 0.0395728 1.22299 0.0395728 0.881282 0.381282Z" fill="currentColor"/>
                </svg>
            </button>
        </nav>
    );
};

export default Pagination;