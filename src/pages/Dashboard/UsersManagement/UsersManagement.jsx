import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { FaUserShield, FaUserSlash } from 'react-icons/fa';
import Swal from 'sweetalert2';

const UsersManagement = () => {
    const axiosSecure = useAxiosSecure();
    const [searchText, setSearchText] = useState("");

    const { refetch, data: users = [] } = useQuery({
        queryKey: ["users", searchText],
        queryFn: async () => {
            const res = await axiosSecure.get(`/users?searchText=${searchText}`);
            return res.data;
        }
    })

    const handleMakeAdmin = user => {
        const roleInfo = { role: "admin" };
        axiosSecure.patch(`/users/${user._id}/role`, roleInfo)
            .then(res => {
                if (res.data.modifiedCount) {
                    refetch();
                    Swal.fire({
                        title: "Confirmed!",
                        text: `${user.displayName} marked as an admin!`,
                        icon: "success"
                    });
                }
            })
    }

    const handleRemoveAdmin = user => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes!"
        }).then((result) => {
            if (result.isConfirmed) {
                const roleInfo = { role: "user" };
                axiosSecure.patch(`/users/${user._id}/role`, roleInfo)
                    .then(res => {
                        console.log(res.data);

                        if (res.data.modifiedCount) {
                            refetch();
                            Swal.fire({
                                title: "Confirmed!",
                                text: `${user.displayName} marked as an user!`,
                                icon: "success"
                            });
                        }
                    })
            }
        });
    }

    return (
        <div>
            <h2 className='text-4xl font-bold text-center pt-8'>Manage Users: {users.length}</h2>

            <div className='flex justify-center my-8'>
                <label className="input">
                    <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <g
                            strokeLinejoin="round"
                            strokeLinecap="round"
                            strokeWidth="2.5"
                            fill="none"
                            stroke="currentColor"
                        >
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.3-4.3"></path>
                        </g>
                    </svg>
                    <input onChange={(e) => setSearchText(e.target.value)} type="search" className="grow" placeholder="Search users" />
                </label>
            </div>

            <div className="overflow-x-auto">
                <table className="table">
                    {/* head */}
                    <thead>
                        <tr>
                            <th>
                                #
                            </th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Creation Time</th>
                            <th>Role</th>
                            <th>Admin Actions</th>
                            <th>Other Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            users.map((user, i) =>
                                <tr key={i}>
                                    <th>
                                        {i + 1}
                                    </th>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="avatar">
                                                <div className="mask mask-squircle h-12 w-12">
                                                    <img
                                                        src={user.photoURL} />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold">{user.displayName}</div>
                                                <div className="text-sm opacity-50">United States</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        {user.email}
                                    </td>
                                    <td>{user.createdAt}</td>
                                    <td>{user.role}</td>
                                    <td>
                                        {user.role === "admin" ? <button onClick={() => handleRemoveAdmin(user)} title='Remove from admin' className='btn bg-red-500'><FaUserSlash /></button> : <button onClick={() => handleMakeAdmin(user)} title='Make admin' className='btn btn-primary text-black'><FaUserShield /></button>}
                                    </td>
                                    <th>
                                        <button className="btn btn-ghost btn-xs">details</button>
                                    </th>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UsersManagement;