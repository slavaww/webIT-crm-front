import React from 'react';

const ClientProfileSection = ({ profile, onChange }) => {
    if (!profile) return null;

    return (
        <div>
            <h3>Профиль клиента</h3>
            <div className="mb-3">
                <label htmlFor="title" className="form-label">Название клиента (ФИО или компания)</label>
                <input type="text" className="form-control" id="title" name="title" value={profile.title} onChange={onChange} />
            </div>
            <div className="mb-3">
                    <label htmlFor="description" className="form-label">Описание</label>
                    <textarea className="form-control" id="description" name="description" value={profile.description || ''} onChange={onChange} rows="3"></textarea>
                </div>
            <div className="mb-3">
                <label htmlFor="job_title" className="form-label">Должность</label>
                <input type="text" className="form-control" id="job_title" name="job_title" value={profile.job_title || ''} onChange={onChange} />
            </div>
            <div className="mb-3">
                <label htmlFor="email" className="form-label">Контактный Email</label>
                <input type="email" className="form-control" id="email" name="email" value={profile.email || ''} onChange={onChange} />
            </div>
            <div className="mb-3">
                <label htmlFor="phone" className="form-label">Телефон</label>
                <input type="text" className="form-control" id="phone" name="phone" value={profile.phone || ''} onChange={onChange} />
            </div>
        </div>
    );
};

export default ClientProfileSection;
