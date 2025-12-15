import {Form} from 'react-bootstrap';

const UserProfileSection = ({ user, onChange, colSpan = 'col-6'}) => {
    if (!user) return null;

    return (
        <div className={colSpan}>
            <Form.Group className="mb-3" controlId="name">
                <Form.Label>Имя</Form.Label>
                <Form.Control type="text" className="form-control" name="name" value={user.name || ''} onChange={onChange} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="patronymic">
                <Form.Label>Отчество</Form.Label>
                <Form.Control type="text" name="patronymic" value={user.patronymic || ''} onChange={onChange} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="surname">
                <Form.Label>Фамилия</Form.Label>
                <Form.Control type="text" name="surname" value={user.surname || ''} onChange={onChange} />
            </Form.Group>
        </div>
    );
};

export default UserProfileSection;
