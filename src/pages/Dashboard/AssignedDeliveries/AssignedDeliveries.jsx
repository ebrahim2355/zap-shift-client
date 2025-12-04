import { useQuery } from '@tanstack/react-query';
import React from 'react';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const AssignedDeliveries = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: parcels = [], refetch } = useQuery({
        queryKey: ["parcels", user.email, "driver_assigned"],
        queryFn: async () => {
            const res = await axiosSecure.get(`/parcels/rider?riderEmail=${user.email}&deliveryStatus=driver_assigned`)
            return res.data;
        }
    })

    const handleDeliveryStatusUpdate = (parcel, status) => {
        const statusInfo = { 
            deliveryStatus: status, 
            riderId: parcel.riderId,
            trackingId: parcel.trackingId
        }
        axiosSecure.patch(`/parcels/${parcel._id}/status`, statusInfo)
            .then(res => {
                if (res.data.modifiedCount) {
                    refetch();
                    Swal.fire({
                        title: "Assigned!",
                        text: `Parcel status updated with ${status.split("_").join(" ")}!`,
                        icon: "success"
                    });
                }
            })
    }

    const handleRejectDelivery = parcel => {
        const statusInfo = { deliveryStatus: "rider_rejected" }
        axiosSecure.patch(`/parcels/${parcel._id}/status`, statusInfo)
            .then(res => {
                if (res.data.modifiedCount) {
                    refetch();
                    Swal.fire({
                        title: "Rejected!",
                        text: "You rejected this delivery!",
                        icon: "error"
                    });
                }
            })
    }

    return (
        <div>
            <h2 className='text-4xl font-bold my-8 text-center'>Parcels Pending Pickup: {parcels.length}</h2>

            <div className="overflow-x-auto">
                <table className="table table-zebra">
                    {/* head */}
                    <thead>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Confirm or Reject</th>
                            <th>Sender Name</th>
                            <th>Sender Phone No</th>
                            <th>Parcel Weight</th>
                            <th>Mark as</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            parcels.map((parcel, i) =>
                                <tr key={parcel._id}>
                                    <th>{i + 1}</th>
                                    <td>{parcel.parcelName}</td>
                                    <td>
                                        {
                                            parcel.deliveryStatus === "driver_assigned" && <>
                                                <button onClick={() => handleDeliveryStatusUpdate(parcel, "rider_arriving")} className='btn bg-primary'>Accept</button>
                                                <button onClick={() => handleRejectDelivery(parcel)} className='btn bg-warning ms-1'>Reject</button>
                                            </>
                                        }
                                        {
                                            (parcel.deliveryStatus === "rider_arriving" || parcel.deliveryStatus === "parcel_picked_up") && <>
                                                <p className='text-green-500'>Accepted!</p>
                                            </>
                                        }
                                        {
                                            (parcel.deliveryStatus === "parcel_delivered") && <>
                                                <p className='text-green-500'>Delivered!</p>
                                            </>
                                        }
                                        {
                                            parcel.deliveryStatus === "rider_rejected" && <>
                                                <p className='text-red-500'>You rejected this delivery!</p>
                                            </>
                                        }
                                        {/* <button onClick={() => handleDeliveryStatusUpdate(parcel, "driver_assigned")} className='btn btn-primary text-black'>All Zero!</button> */}

                                    </td>
                                    <td>{parcel.senderName}</td>
                                    <td>{parcel.senderPhoneNo}</td>
                                    <td>{parcel.parcelWeight} kg</td>
                                    <td>
                                        {
                                            parcel.deliveryStatus === "rider_arriving" ? <button onClick={() => handleDeliveryStatusUpdate(parcel, "parcel_picked_up")} className='btn btn-primary text-black'>Mark as picked up!</button> :
                                                ""
                                        }
                                        {
                                            parcel.deliveryStatus === "parcel_picked_up" ? <button onClick={() => handleDeliveryStatusUpdate(parcel, "parcel_delivered")} className='btn btn-success text-black'>Mark as delivered!</button> :
                                                ""
                                        }
                                        {
                                            parcel.deliveryStatus === "parcel_delivered" && <p className='text-green-500 items-center'>Successfully Delivered!!</p>
                                        }
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

export default AssignedDeliveries;