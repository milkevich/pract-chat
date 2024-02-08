import React from 'react'
import { useUserContext } from '../Contexts/UserContext'
import { Outlet } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

export const MainLayout = () => {
    const { isInitialized } = useUserContext();

    return (
        !isInitialized ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress style={{ color: 'darkgray' }} />
            </div>
        ) : <Outlet />
    )
}
