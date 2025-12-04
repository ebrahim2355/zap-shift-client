import React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useLoaderData, useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import { ErrorMsg } from '../../components/ErrorMsg/ErrorMsg';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';

const SendParcel = () => {

    const { register, handleSubmit, control, reset, formState: { errors } } = useForm();
    const { user } = useAuth();

    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const serviceCenters = useLoaderData();
    const regionsDuplicate = serviceCenters.map(c => c.region);
    const regions = [...new Set(regionsDuplicate)];
    const senderRegion = useWatch({ control, name: "senderRegion" });
    const receiverRegion = useWatch({ control, name: "receiverRegion" })

    const districtsByRegion = region => {
        const regionDistricts = serviceCenters.filter(c => c.region === region);
        const districts = regionDistricts.map(d => d.district);
        return districts;
    }

    const handleSendParcel = (data) => {
        console.log(data);
        const isDocument = data.parcelType === "document";
        const isSameDistrict = data.senderDistrict === data.receiverDistrict;
        const parcelWeight = parseFloat(data.parcelWeight) || 1;

        let cost = 0;

        if (isDocument) {
            cost = isSameDistrict ? 60 : 80;
        }
        else {
            if (parcelWeight < 3) {
                cost = isSameDistrict ? 110 : 150;
            }
            else {
                const minCharge = isSameDistrict ? 110 : 150;
                const extraWeight = parcelWeight - 3;
                const extraCharge = isSameDistrict ? extraWeight * 40 : extraWeight * 40 + 40;

                cost = minCharge + extraCharge;
            }
        }
        console.log(cost);
        data.cost = cost;

        Swal.fire({
            title: "Please confirm the cost.",
            text: `You will be charged ${cost} Taka!`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "All Right!"
        }).then((result) => {
            if (result.isConfirmed) {

                // save the parcel info to the database
                axiosSecure.post("/parcels", data)
                    .then(res => {
                        console.log(res.data);
                        if (res.data.insertedId) {
                            navigate("/dashboard/my-parcels")
                            Swal.fire({
                                title: "Confirmed!",
                                text: "Your order has been placed!",
                                icon: "success"
                            });

                            reset();
                        }
                    })
            }
        });
    }

    return (
        <div className='p-8 md:p-14 lg:p-20 rounded-4xl shadow-2xl my-20'>
            <h2 className="text-5xl font-bold">Send A Parcel</h2>
            <form onSubmit={handleSubmit(handleSendParcel)} className='mt-8'>
                {/* document */}
                <h4 className='text-2xl font-bold'>Enter your parcel details</h4>

                <div className='border-t border-gray-300 my-8'></div>

                <div className='flex gap-5'>
                    <label className="label">
                        <input type="radio" {...register("parcelType")} value="document" className="radio" defaultChecked />
                        Document
                    </label>
                    <label className="label">
                        <input type="radio" {...register("parcelType")} value="non-document" className="radio" />
                        Non-Document
                    </label>
                </div>

                {/* parcel info */}
                <div className='grid grid-cols-1 md:grid-cols-2 my-8 gap-4 md:gap-8'>
                    <fieldset className="fieldset">
                        <label className="label">Parcel Name</label>
                        <input type="text" {...register("parcelName", { required: true })} className="input w-full" placeholder="Parcel Name" />
                        <ErrorMsg error={errors.parcelName} />
                    </fieldset>
                    <fieldset className="fieldset">
                        <label className="label">Parcel Weight(KG)</label>
                        <input type="number" {...register("parcelWeight", { required: true })} className="input w-full" placeholder="Parcel Weight" />
                        <ErrorMsg error={errors.parcelWeight} />
                    </fieldset>
                </div>

                <div className='border-t border-gray-300 my-8'></div>

                {/* two column */}
                <div className='grid grid-cols-1 md:grid-cols-2 my-8 gap-4 md:gap-8'>
                    {/* sender info */}
                    <div>
                        <h4 className="text-xl font-semibold">Sender Details</h4>
                        <fieldset className="fieldset">
                            <label className="label mt-4">Sender Name</label>
                            <input type="text" {...register("senderName", { required: true })} className="input w-full" defaultValue={user?.displayName} placeholder="Sender Name" />
                            <ErrorMsg error={errors.senderName} />

                            <label className="label mt-3">Sender Email Address</label>
                            <input type="email" {...register("senderEmail", { required: true })} className="input w-full"
                                defaultValue={user?.email}
                                placeholder="Sender Email Address" />
                            <ErrorMsg error={errors.senderEmail} />

                            <label className="label mt-3">Sender Phone No</label>
                            <input type="number" {...register("senderPhoneNo", { required: true })} className="input w-full" placeholder="Sender Phone No" />
                            <ErrorMsg error={errors.senderPhoneNo} />

                            <fieldset className="fieldset">
                                <legend className="label pt-3">Sender Region</legend>
                                <select {...register("senderRegion", { required: true })} defaultValue="" className="select w-full">
                                    <option value={""} disabled={true}>Pick a Region</option>
                                    {
                                        regions.map((r, i) => <option key={i} value={r}>{r}</option>)
                                    }
                                </select>
                                <ErrorMsg error={errors.senderRegion} />
                            </fieldset>

                            <label className="label mt-3">Sender District</label>
                            <select {...register("senderDistrict", { required: true })} defaultValue="" className="select w-full">
                                <option value={""} disabled={true}>Pick a District</option>
                                {
                                    districtsByRegion(senderRegion).map((r, i) => <option key={i} value={r}>{r}</option>)
                                }
                            </select>
                            <ErrorMsg error={errors.senderDistrict} />

                            <label className="label mt-3">Pickup Instruction</label>
                            <textarea
                                {...register("pickupInstruction")}
                                className="textarea w-full"
                                placeholder="Pickup Instruction"
                            ></textarea>

                        </fieldset>
                    </div>
                    {/* receiver info */}
                    <div>
                        <h4 className="text-xl font-semibold">Receiver Details</h4>
                        <fieldset className="fieldset">
                            <label className="label mt-4">Receiver Name</label>
                            <input type="text" {...register("receiverName", { required: true })} className="input w-full" placeholder="Receiver Name" />
                            <ErrorMsg error={errors.receiverName} />

                            <label className="label mt-3">Receiver Email Address</label>
                            <input type="email" {...register("receiverEmail", { required: true })} className="input w-full" placeholder="Receiver Email Address" />
                            <ErrorMsg error={errors.receiverEmail} />

                            <label className="label mt-3">Receiver Phone No</label>
                            <input type="number" {...register("receiverPhoneNo", { required: true })} className="input w-full" placeholder="Receiver Phone No" />
                            <ErrorMsg error={errors.receiverPhoneNo} />

                            <fieldset className="fieldset">
                                <legend className="label pt-3">Receiver Region</legend>
                                <select {...register("receiverRegion", { required: true })} defaultValue="" className="select w-full">
                                    <option value={""} disabled={true}>Pick a Region</option>
                                    {
                                        regions.map((r, i) => <option key={i} value={r}>{r}</option>)
                                    }
                                </select>
                                <ErrorMsg error={errors.receiverRegion} />
                            </fieldset>

                            <label className="label mt-3">Receiver District</label>
                            <select {...register("receiverDistrict", { required: true })} defaultValue="" className="select w-full">
                                <option value={""} disabled={true}>Pick a District</option>
                                {
                                    districtsByRegion(receiverRegion).map((d, i) => <option key={i} value={d}>{d}</option>)
                                }
                            </select>
                            <ErrorMsg error={errors.receiverDistrict} />

                            <label className="label mt-3">Delivery Instruction</label>
                            <textarea
                                {...register("deliveryInstruction")}
                                className="textarea w-full"
                                placeholder="Delivery Instruction"
                            ></textarea>

                        </fieldset>
                    </div>
                </div>
                <input className='btn btn-primary text-black w-full md:' type="submit" value="Proceed to Confirm Booking" />
            </form>
        </div>
    );
};

export default SendParcel;