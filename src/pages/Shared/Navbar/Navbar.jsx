import React from 'react';
import Logo from '../../../components/logo/Logo';
import { Link, NavLink } from 'react-router';
import useAuth from '../../../hooks/useAuth';

const Navbar = () => {

    const { user, logOut } = useAuth();

    const handleLogOut = () => {
        logOut().then()
            .catch(err => {
                console.log(err);
            })
    }

    const links = <>
        {
            user && <>
                <li><NavLink to={"/dashboard"}>Dashboard</NavLink></li>
            </>
        }
        <li><NavLink to>Services</NavLink></li>
        <li><NavLink to={"/send-parcel"}>Send a Parcel</NavLink></li>
        <li><NavLink to={"/coverage"}>Coverage Areas</NavLink></li>
        {
            user && <>
                <li><NavLink to={"/dashboard/my-parcels"}>My Parcels</NavLink></li>
            </>
        }
        <li><NavLink>About Us</NavLink></li>
    </>

    return (
        <div className="navbar bg-base-100 rounded-2xl">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                    </div>
                    <ul
                        tabIndex="-1"
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        {links}
                    </ul>
                </div>
                <span className=" btn-ghost text-xl"><Logo></Logo></span>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    {links}
                </ul>
            </div>
            <div className="navbar-end gap-3">
                {
                    user ?
                        <a onClick={handleLogOut} className="btn btn-primary text-black">Log Out</a>
                        :
                        <Link to={"/login"} className="btn btn-primary text-black">Login</Link>
                }
                <Link to={"/rider"} className="btn btn-primary text-black">Be a Rider</Link>
            </div>
        </div>
    );
};

export default Navbar;