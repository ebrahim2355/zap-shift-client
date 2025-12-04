import React from 'react';
import { Link } from 'react-router';

const PaymentCancelled = () => {
    return (
        <div>
            <h2 className='text-4xl'>Payment is Cancelled. Please try again.</h2>
            <Link className='btn btn-primary text-black' to={"/dashboard/my-parcels"}>Try Again</Link>
        </div>
    );
};

export default PaymentCancelled;