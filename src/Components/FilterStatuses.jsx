const FilterStatuses = ({ className = "filter-statuses", statuses, statusFilter, handleFilter }) => {
    return (
        <div className={className}>
            <div className={`list-unstyled ${className}-list`}>
                {/* Кнопки статусов */}
                {statuses.slice(0, 7).map(status => (
                    <button
                        className={`btn-switch${statusFilter.includes(status.id) ? ' active' : ''}`}
                        id={status.id}
                        key={status.id}
                        onClick={() => handleFilter(status.id)}
                    >
                        {status.status}
                    </button>
                ))}
                <button className={`btn-switch${statusFilter.length === 0 ? ' active' : ''}`} onClick={() => handleFilter('all')}>Все</button>
            </div>
        </div>
    );
};

export default FilterStatuses;