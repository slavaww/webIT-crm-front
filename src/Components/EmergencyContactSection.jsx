import React from 'react';

const EmergencyContactSection = ({ contactData, isVisible, onChange, onShow, onDelete }) => {
    return (
        <div className="emergency-contact-section">
            <legend className="h5">Экстренный контакт</legend>
            {isVisible ? (
                <fieldset>
                    <p className="text-muted small">Заполните, если хотите указать заместителя. Чтобы удалить, очистите все поля и сохраните, или нажмите кнопку "Удалить".</p>
                    <div className="mb-3">
                        <label htmlFor="emrg_title" className="form-label">ФИО контакта</label>
                        <input type="text" className="form-control" id="emrg_title" name="title" value={contactData.title || ''} onChange={onChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="emrg_job_title" className="form-label">Должность</label>
                        <input type="text" className="form-control" id="emrg_job_title" name="job_title" value={contactData.job_title || ''} onChange={onChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="emrg_email" className="form-label">Email</label>
                        <input type="email" className="form-control" id="emrg_email" name="email" value={contactData.email || ''} onChange={onChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="emrg_phone" className="form-label">Телефон</label>
                        <input type="text" className="form-control" id="emrg_phone" name="phone" value={contactData.phone || ''} onChange={onChange} />
                    </div>
                    <button type="button" onClick={onDelete} className="btn btn-sm btn-outline-danger">Удалить доп. контакт</button>
                </fieldset>
            ) : (
                <button type="button" onClick={onShow} className="btn btn-secondary">Добавить дополнительный контакт</button>
            )}
        </div>
    );
};

export default EmergencyContactSection;