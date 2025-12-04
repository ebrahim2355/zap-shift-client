import React from 'react';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const CompletedDeliveries = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: parcels = [] } = useQuery({
        queryKey: ["parcels", user.email, "parcel_delivered"],
        queryFn: async () => {
            const res = await axiosSecure.get(`/parcels/rider?riderEmail=${user.email}&deliveryStatus=parcel_delivered`)
            return res.data;
        }
    })

    const calculatePayout = parcel => {
        if(parcel.senderDistrict === parcel.receiverDistrict){
            return parcel.cost * 0.8;
        } else {
            return parcel.cost * 0.6;
        }
    }

    return (
        <div>
            <h2 className='text-4xl font-bold text-center my-8'>Completed Deliveries: {parcels.length}</h2>

            <div className="overflow-x-auto">
                <table className="table table-zebra">
                    {/* head */}
                    <thead>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Time & Date</th>
                            <th>Parcel Weight</th>
                            <th>Delivery Cost</th>
                            <th>Your Payout</th>
                            <th>Cash Out Your Pay</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            parcels.map((parcel, i) =>
                                <tr key={parcel._id}>
                                    <th>{i + 1}</th>
                                    <td>{parcel.parcelName}</td>
                                    <td>{parcel.createdAt}
                                    </td>
                                    <td>{parcel.parcelWeight} kg</td>
                                    <td>{parcel.cost}</td>
                                    <td>{calculatePayout(parcel)}</td>
                                    <td>
                                        <button className='btn btn-primary text-black'>Cash Out</button>
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

export default CompletedDeliveries;