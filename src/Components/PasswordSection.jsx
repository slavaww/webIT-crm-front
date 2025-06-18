import React from 'react';

const PasswordSection = ({ password, onChange }) => {

    return (
        <div className="mb-3">
            <label htmlFor="password" className="form-label fw-bold">Новый пароль</label>
            <input 
                type="password" 
                className="form-control" 
                id="password" 
                name="password" 
                value={password} 
                onChange={onChange} 
                placeholder="Оставьте пустым, если не хотите менять" 
            />
        </div>
    );
};

export default PasswordSection;