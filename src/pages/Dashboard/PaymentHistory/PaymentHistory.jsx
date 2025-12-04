import { useQuery } from '@tanstack/react-query';
import React from 'react';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const PaymentHistory = () => {

    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const { data: payments = [] } = useQuery({
        queryKey: ['payments', user.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/payments?email=${user.email}`)
            return res.data;
        }
    })

    return (
        <div>
            <h2 className='text-5xl'>Payment History: {payments.length}</h2>
            <div className="overflow-x-auto">
                <table className="table table-zebra">
                    {/* head */}
                    <thead>
                        <tr>
                            <th></th>
                            <th>Parcel Name</th>
                            <th>Amount</th>
                            <th>Transaction ID</th>
                            <th>Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            payments.map((payment, i) => 
                                <tr key={payment._id}>
                                    <th>{i + 1}</th>
                                    <td>{payment.parcelName}</td>
                                    <td>${payment.amount}</td>
                                    <td>{payment.transactionId}</td>
                                    <td>{payment.paidAt}</td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PaymentHistory;