import React from 'react';
import Login from '../Components/Login';

const LoginPage = () => {
    return (
        <div className="container">
            <div className="row justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                <div className="col-md-6">
                    <Login />
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
