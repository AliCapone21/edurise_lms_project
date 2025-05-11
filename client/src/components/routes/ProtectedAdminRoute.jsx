import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';

const ProtectedAdminRoute = ({ children }) => {
    const { userData } = useContext(AppContext);

    if (!userData || userData.role !== 'admin') {
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedAdminRoute;
