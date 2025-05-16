type PaginationProps = {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    onChangePage: (page: number) => void;
    onChangeSize: (size: number) => void;
};

export const Pagination = ({
                               currentPage,
                               itemsPerPage,
                               totalItems,
                               onChangePage,
                               onChangeSize
                           }: PaginationProps) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages <= 1) return null;

    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

    return (
        <div className="pagination">
            <button
                onClick={() => onChangePage(1)}
                disabled={currentPage === 1}
                aria-label="Первая страница"
            >
                «
            </button>
            <button
                onClick={() => onChangePage(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Предыдущая страница"
            >
                ‹
            </button>

            {startPage > 1 && <span className="ellipsis">...</span>}

            {pages.map(page => (
                <button
                    key={page}
                    onClick={() => onChangePage(page)}
                    className={currentPage === page ? 'active' : ''}
                    aria-label={`Страница ${page}`}
                    aria-current={currentPage === page ? 'page' : undefined}
                >
                    {page}
                </button>
            ))}

            {endPage < totalPages && <span className="ellipsis">...</span>}

            <button
                onClick={() => onChangePage(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Следующая страница"
            >
                ›
            </button>
            <button
                onClick={() => onChangePage(totalPages)}
                disabled={currentPage === totalPages}
                aria-label="Последняя страница"
            >
                »
            </button>

            <select
                value={itemsPerPage}
                onChange={(e) => onChangeSize(Number(e.target.value))}
                aria-label="Количество элементов на странице"
            >
                {[5, 10, 20, 50].map(size => (
                    <option key={size} value={size}>
                        {size} на странице
                    </option>
                ))}
            </select>
        </div>
    );
};
