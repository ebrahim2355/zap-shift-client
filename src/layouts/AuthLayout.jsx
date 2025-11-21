import React from 'react';
import Logo from '../components/logo/Logo';
import { Outlet } from 'react-router';
import authImg from "../assets/authImage.png"

const AuthLayout = () => {
    return (
        <div className='max-w-7xl mx-auto'>
            <div className='p-6'>
                <Logo></Logo>
            </div>
            <div className='flex items-center mt-12'>
                <div className='flex-1 p-8'>
                    <Outlet></Outlet>
                </div>
                <div className='flex-1 hidden sm:block'>
                    <img src={authImg} alt="" />
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;