import {Form} from 'react-bootstrap';

const PasswordSection = ({ password, onChange }) => {

    return (
        <div className="col-12 mb-3">
            <Form.Label htmlFor="password">Новый пароль</Form.Label>
            <Form.Control
                type="password"
                id="password"
                name="password" 
                value={password} 
                onChange={onChange} 
                placeholder="Оставьте пустым, если не хотите менять" 
                aria-describedby="passwordHelpBlock"
            />
            <Form.Text id="passwordHelpBlock" muted>
                Your password must be 8-20 characters long, contain letters and numbers,
                and must not contain spaces, special characters, or emoji.
            </Form.Text>
        </div>
    );
};

export default PasswordSection;