import { useQuery } from '@tanstack/react-query';
import React from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { FaCheckSquare, FaEye, FaTrashAlt } from 'react-icons/fa';
import { ImCross } from 'react-icons/im';
import Swal from 'sweetalert2';

const ApproveRiders = () => {
    const axiosSecure = useAxiosSecure();
    const {refetch, data: riders = [] } = useQuery({
        queryKey: ["riders", "pending"],
        queryFn: async () => {
            const res = await axiosSecure.get("/riders");
            return res.data;
        }
    })

    const updateRiderStatus = (rider, status) => {
        const updateInfo = { status: status, email: rider.yourEmail };
        axiosSecure.patch(`/riders/${rider._id}`, updateInfo)
            .then(res => {
                if (res.data.modifiedCount) {
                    refetch();
                    Swal.fire({
                        title: "Confirmed!",
                        text: `Rider status is set to ${status}!`,
                        icon: "success"
                    });
                }
            })
    }

    const handleApproval = rider => {
        updateRiderStatus(rider, "approved");
    }

    const handleRejection = rider =>{
        updateRiderStatus(rider, "rejected");
    }

    const handleRiderDelete = id => {
            console.log(id);
    
            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!"
            }).then((result) => {
                if (result.isConfirmed) {
    
                    axiosSecure.delete(`/riders/${id}`)
                        .then(res => {
                            console.log(res.data);
    
                            if (res.data.deletedCount) {
                                refetch();
    
                                Swal.fire({
                                    title: "Deleted!",
                                    text: "Rider request has been deleted.",
                                    icon: "success"
                                });
                            }
                        })
                }
            });
        }

    return (
        <div>
            <h2 className='text-5xl font-bold my-8 text-center'>Riders Pending Approval: {riders.length}</h2>
            <div className="overflow-x-auto">
                <table className="table table-zebra">
                    {/* head */}
                    <thead>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Application Status</th>
                            <th>Work Status</th>
                            <th>District</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            riders.map((rider, i) =>
                                <tr>
                                    <th>{i + 1}</th>
                                    <td>{rider.yourName}</td>
                                    <td>{rider.yourEmail}</td>
                                    <td>
                                        <p className={`${rider.status === "approved" ? "text-green-800" : "text-red-500"} `}>{rider.status}</p>
                                    </td>
                                    <td>{rider.workStatus}</td>
                                    <td>{rider.district}</td>
                                    <td className='flex gap-1'>
                                        <button onClick={() => handleRejection(rider)} title='View Details' className='btn'><FaEye /></button>
                                        <button onClick={() => handleApproval(rider)} title='Approve Rider' className='btn'><FaCheckSquare /></button>
                                        <button onClick={() => handleRejection(rider)} title='Reject the Rider' className='btn'><ImCross /></button>
                                        <button onClick={() => handleRiderDelete(rider._id)} title='Delete' className='btn'><FaTrashAlt /></button>
                                    </td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ApproveRiders;