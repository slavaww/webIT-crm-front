const FilterCreate = ({ className = "filter-create", startDateFilter, endDateFilter, setStartDateFilter, setEndDateFilter }) => {
    return (
        <div className={className}>
            <div className={ className + "-wrap"}>
            <div className={ className + "-desc"}>Создана:</div>
            <div className={className + "-inputs"}>
                <label htmlFor="start-date" className={`form-label mb-0 ${className}-label${startDateFilter ? ' active' : ''}`}></label>
                <input
                type="date"
                id="start-date"
                className="form-control"
                value={startDateFilter}
                onChange={(e) => setStartDateFilter(e.target.value)}
                />
                <label htmlFor="end-date" className={`form-label mb-0 ms-2 ${className}-label${endDateFilter ? ' active' : ''}`}></label>
                <input
                type="date"
                id="end-date"
                className="form-control"
                value={endDateFilter}
                onChange={(e) => setEndDateFilter(e.target.value)}
                />
            </div>
            </div>
        </div>

    );
};

export default FilterCreate;