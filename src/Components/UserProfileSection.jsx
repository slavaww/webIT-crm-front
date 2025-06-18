import React from 'react';

const UserProfileSection = ({ user, onChange }) => {
    if (!user) return null;

    return (
        <fieldset>
            <div className="mb-3">
                <label htmlFor="name" className="form-label">Имя</label>
                <input type="text" className="form-control" id="name" name="name" value={user.name || ''} onChange={onChange} />
            </div>
            <div className="mb-3">
                <label htmlFor="patronymic" className="form-label">Отчество</label>
                <input type="text" className="form-control" id="patronymic" name="patronymic" value={user.patronymic || ''} onChange={onChange} />
            </div>
            <div className="mb-3">
                <label htmlFor="surname" className="form-label">Фамилия</label>
                <input type="text" className="form-control" id="surname" name="surname" value={user.surname || ''} onChange={onChange} />
            </div>
        </fieldset>
    );
};

export default UserProfileSection;
