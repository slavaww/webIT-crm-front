import UserSVG from '../Components/UserSVG';


const FilterWorker = ({ className = "filter-worker", employees, isRole, workerFilter, setWorkerFilter }) => {
    return (
        <div className={className}>
            {(isRole.client) && (
            <div className="filter-worker-wrap">
                <div className="filter-worker-label">Исполнитель:</div>
                <div className="filter-worker-btns">
                <button
                    className={`btn-switch users${workerFilter === 1 ? ' active' : ''}`}
                    key="1"
                    onClick={() => setWorkerFilter(1)}
                >
                    <UserSVG type="1" />
                </button>
                <button
                    className={`btn-switch users${workerFilter === 2 ? ' active' : ''}`}
                    key="2"
                    onClick={() => setWorkerFilter(2)}
                >
                    <UserSVG type="0" />
                </button>
                <button
                    className={`btn-switch users${workerFilter === '' ? ' active' : ''}`}
                    key="3"
                    onClick={() => setWorkerFilter("")}
                >
                    <UserSVG type="all" />
                </button>
                </div>
            </div>
            )}
            {(isRole.superAdmin) && (
            <>
                <label htmlFor="worker-filter" className="form-label mb-0">Исполнитель:</label>
                <select
                id="worker-filter"
                className="form-select"
                value={workerFilter}
                onChange={(e) => setWorkerFilter(e.target.value)}
                >
                <option value="">Все</option>
                {employees.map(employee => (
                    <option key={employee.id} value={employee.id}>{employee.user_id.name} {employee.user_id.surname}</option>
                ))}
                </select>
            </>
            )}
        </div>
    );
};
export default FilterWorker;