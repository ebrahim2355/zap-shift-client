import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { FiCopy, FiCheck } from "react-icons/fi";

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const [paymentInfo, setPaymentInfo] = useState();
    const [copied, setCopied] = useState(null);
    const sessionId = searchParams.get("session_id");
    const axiosSecure = useAxiosSecure();

    useEffect(() => {
        if (sessionId) {
            axiosSecure.patch(`/payment-success?session_id=${sessionId}`)
                .then(res => {
                    setPaymentInfo({
                        transactionId: res.data.transactionId,
                        trackingId: res.data.trackingId
                    });
                });
        }
    }, [sessionId, axiosSecure]);

    const handleCopy = (text, type) => {
        navigator.clipboard.writeText(text);
        setCopied(type);
        setTimeout(() => setCopied(null), 1500);
    };

    return (
        <div className="max-w-lg mx-auto mt-10 p-8 bg-white shadow-lg rounded-xl text-center border">
            <h2 className="text-4xl font-semibold text-green-600 mb-6">
                Payment Successful 🎉
            </h2>

            {paymentInfo && (
                <div className="space-y-6">
                    {/* Transaction ID */}
                    <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg">
                        <div className="text-left">
                            <p className="text-sm font-medium text-gray-500">Transaction ID</p>
                            <p className="font-semibold text-gray-800 break-all">
                                {paymentInfo.transactionId}
                            </p>
                        </div>

                        <button
                            className="text-gray-600 hover:text-black transition"
                            onClick={() => handleCopy(paymentInfo.transactionId, "transaction")}
                        >
                            {copied === "transaction" ? (
                                <FiCheck className="text-green-600" size={22} />
                            ) : (
                                <FiCopy size={22} className=' cursor-pointer' />
                            )}
                        </button>
                    </div>

                    {/* Tracking ID */}
                    <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg">
                        <div className="text-left">
                            <p className="text-sm font-medium text-gray-500">Tracking ID</p>
                            <p className="font-semibold text-gray-800 break-all">
                                {paymentInfo.trackingId}
                            </p>
                        </div>

                        <button
                            className="text-gray-600 hover:text-black transition"
                            onClick={() => handleCopy(paymentInfo.trackingId, "tracking")}
                        >
                            {copied === "tracking" ? (
                                <FiCheck className="text-green-600" size={22} />
                            ) : (
                                <FiCopy size={22} className=' cursor-pointer'/>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentSuccess;
