const UserInfo = ({ 
    user, 
    showPatronymic = true, 
    showSurname = true,
    role = "Administrator",
    className = "" 
}) => {
    return (
        <div className={`me-2 me-md-3 me-lg-5 ${className}`}>
            <h2 className='mb-0'>
                <span>{user?.name}</span>
                {showPatronymic && (
                    <span className='d-none d-md-inline-block ps-1'>
                        {user?.patronymic}
                    </span>
                )}
                {showSurname && (
                    <span className='d-none d-sm-inline-block ps-1'>
                        {user?.surname}
                    </span>
                )}
            </h2>
            {role && (
                <p className="small mb-0 text-end">{role}</p>
            )}
        </div>
    );
};

export default UserInfo;