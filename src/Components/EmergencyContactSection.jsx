import { Accordion, Button } from 'react-bootstrap';

const EmergencyContactSection = ({ contactData, isVisible, onChange, onShow, onDelete }) => {
    return (
        <Accordion>
            <Accordion.Item eventKey="0">
                <Accordion.Header>Экстренный контакт</Accordion.Header>
                <Accordion.Body>
                    {isVisible ? (
                        <fieldset>
                            <p className="text-muted small">Заполните, если хотите указать дополнительный контакт на время вашего отсутствия.<br />Чтобы удалить, очистите все поля и сохраните, или нажмите кнопку "Удалить".</p>
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
                            <Button onClick={onDelete} variant="outline-danger">Удалить доп. контакт</Button>
                        </fieldset>
                    ) : (
                        <Button onClick={onShow} variant="secondary">Добавить дополнительный контакт</Button>
                    )}
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
};

export default EmergencyContactSection;