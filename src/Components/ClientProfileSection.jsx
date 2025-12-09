import React from 'react';

const ClientProfileSection = ({ profile, onChange }) => {
    if (!profile) return null;

    return (
        <>
            <div className="col-12">
                <h3>Профиль компании</h3>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Наименование</label>
                    <input type="text" className="form-control" id="title" name="title" value={profile.title} onChange={onChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Описание (не обязательно)</label>
                    <textarea className="form-control" id="description" name="description" value={profile.description || ''} onChange={onChange} rows="3"></textarea>
                    <div id="description-help" className="form-text">Вид деятельности, особенности и т.д. в свободной форме.</div>
                </div>
            </div>
            <div className="col-6">
                <div className="mb-3">
                    <label htmlFor="job_title" className="form-label">Должность (не обязательно)</label>
                    <input type="text" className="form-control" id="job_title" name="job_title" value={profile.job_title || ''} onChange={onChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Контактный Email</label>
                    <input type="email" className="form-control" id="email" name="email" value={profile.email || ''} onChange={onChange} />
                    <div id="email-help" className="form-text">дополнительный, если необходимо</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="phone" className="form-label">Телефон</label>
                    <input type="text" className="form-control" id="phone" name="phone" value={profile.phone || ''} onChange={onChange} />
                    <div id="phone-help" className="form-text">если необходимо</div>
                </div>
            </div>
        </>
    );
};

export default ClientProfileSection;
