import React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useLoaderData } from 'react-router';
import { ErrorMsg } from '../../components/ErrorMsg/ErrorMsg';
import riderPic from "../../assets/agent-pending.png"
import Swal from 'sweetalert2';

const Rider = () => {

    const { register, handleSubmit, control, reset, formState: { errors } } = useForm();
    const { user } = useAuth();

    const axiosSecure = useAxiosSecure();
    const serviceCenters = useLoaderData();
    const regionsDuplicate = serviceCenters.map(c => c.region);
    const regions = [...new Set(regionsDuplicate)];

    const districtsByRegion = region => {
        const regionDistricts = serviceCenters.filter(c => c.region === region);
        const districts = regionDistricts.map(d => d.district);
        return districts;
    }

    const region = useWatch({ control, name: "region" });

    const handleRiderApplication = data => {
        console.log(data);
        axiosSecure.post("/riders", data)
            .then(res => {
                if (res.data.insertedId) {
                    Swal.fire({
                        title: "Confirmed!",
                        text: "Your application has been submitted. We will reach out to you within 48 hours.",
                        icon: "success"
                    });

                    reset();
                }
            })
    }
    return (
        <div className='p-8 md:p-14 lg:p-20 rounded-4xl shadow-2xl my-20'>
            <h2 className="text-4xl font-bold">Be a Rider</h2>
            <p className='opacity-60 mt-4'>Enjoy fast, reliable parcel delivery with real-time tracking and zero hassle. From personal packages to business shipments — we deliver on time, every time.</p>

            <div className='flex justify-between'>
                <div className='flex-1'>
                    <form onSubmit={handleSubmit(handleRiderApplication)} className='mt-8'>
                        {/* document */}
                        <h4 className='text-2xl font-bold'>Tell us about yourself</h4>

                        <div className='border-t border-gray-300 my-4'></div>

                        {/* two column */}
                        <div className='grid grid-cols-1 lg:grid-cols-2 my-8 gap-3'>
                            {/* sender info */}
                            <div>
                                <fieldset className="fieldset">
                                    <label className="label">Your Name</label>
                                    <input type="text" {...register("yourName", { required: true })} className="input w-full" defaultValue={user?.displayName} placeholder="Your Name" />
                                    <ErrorMsg error={errors.yourName} />

                                    <label className="label mt-3">Driving License Number</label>
                                    <input type="number" {...register("licenseNo", { required: true })} className="input w-full" placeholder="Driving License Number" />
                                    <ErrorMsg error={errors.licenseNo} />

                                    <label className="label mt-3">Your Email</label>
                                    <input type="email" {...register("yourEmail", { required: true })} className="input w-full"
                                        defaultValue={user?.email}
                                        placeholder="Your Email" />
                                    <ErrorMsg error={errors.yourEmail} />

                                    <label className="label mt-3">NID No</label>
                                    <input type="number" {...register("NIDNo", { required: true })} className="input w-full" placeholder="NID No" />
                                    <ErrorMsg error={errors.NIDNo} />

                                    <label className="label mt-3">Bike Brand Model & Year</label>
                                    <input type="text" {...register("modelAndYear", { required: true })} className="input w-full" placeholder="Bike Brand Model & Year" />
                                    <ErrorMsg error={errors.modelAndYear} />

                                </fieldset>
                            </div>
                            {/* receiver info */}
                            <div>
                                <fieldset className="fieldset">

                                    <label className="label">Bike Registration No</label>
                                    <input type="number" {...register("bikeRegistrationNo", { required: true })} className="input w-full" placeholder="Bike Registration No" />
                                    <ErrorMsg error={errors.bikeRegistrationNo} />

                                    <label className="label mt-3">Your Age</label>
                                    <input type="number" {...register("yourAge", { required: true })} className="input w-full" placeholder="Your Age" />
                                    <ErrorMsg error={errors.yourAge} />

                                    <label className="label mt-3">Your Region</label>
                                    <select {...register("region", { required: true })} defaultValue="" className="select w-full">
                                        <option value={""} disabled={true}>Your Region</option>
                                        {
                                            regions.map((r, i) => <option key={i} value={r}>{r}</option>)
                                        }
                                    </select>
                                    <ErrorMsg error={errors.region} />

                                    <label className="label mt-3">Your District</label>
                                    <select {...register("district", { required: true })} defaultValue="" className="select w-full">
                                        <option value={""} disabled={true}>Your District</option>
                                        {
                                            districtsByRegion(region).map((r, i) => <option key={i} value={r}>{r}</option>)
                                        }
                                    </select>
                                    <ErrorMsg error={errors.district} />

                                    <label className="label mt-3">Contact Number</label>
                                    <input type="number" {...register("contactNo", { required: true })} className="input w-full" placeholder="Contact Number" />
                                    <ErrorMsg error={errors.contactNo} />
                                </fieldset>
                            </div>
                        </div>
                        <input className='btn btn-primary text-black w-full md:' type="submit" value="Apply as a Rider" />
                    </form>
                </div>
                <div className='flex-1 hidden sm:block'>
                    <img src={riderPic} alt="" />
                </div>
            </div>
        </div>
    );
};

export default Rider;