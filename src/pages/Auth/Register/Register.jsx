import React from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../../hooks/useAuth';
import { Link, useLocation, useNavigate } from 'react-router';
import SocialLogin from '../SocialLogin/SocialLogin';
import axios from 'axios';

const Register = () => {

    const { register, handleSubmit, formState: { errors } } = useForm();
    const { registerUser, updateUserProfile } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleRegister = (data) => {
        console.log(data);
        const profileImg = data.photo[0];

        registerUser(data.email, data.password)
            .then(res => {
                console.log(res.user);
                // store the image and get the photo url
                const formData = new FormData();
                formData.append("image", profileImg);

                const image_API_URL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`

                axios.post(image_API_URL, formData)
                    .then(res => {
                        console.log("after image upload", res.data.data.url)

                        // update the user profile
                        const userProfile = {
                            displayName: data.name,
                            photoURL: res.data.data.url
                        }

                        updateUserProfile(userProfile)
                            .then(() => {
                                console.log("user profile updated.")
                                navigate(location?.state || "/")
                            })
                            .catch(err => {
                                console.log(err);
                            })
                    })
            })
            .catch(err => {
                console.log(err);
            })
    }
    return (
        <div>
            <h3 className="text-3xl font-bold text-center">Welcome to Zap Shift!</h3>
            <p className='text-center py-2 text-2xl'>Please Register....</p>
            <form onSubmit={handleSubmit(handleRegister)}>
                <fieldset className="fieldset">
                    <label className="label">Your Photo</label>
                    <input type="file" {...register("photo", { required: true })} className="w-full file-input" placeholder="Your Photo" />
                    {errors.photo?.type === "required" && <p className='text-red-500'>Photo is required.</p>}

                    <label className="label">Name</label>
                    <input type="text" {...register("name", { required: true })} className="input w-full" placeholder="Full Name" />
                    {errors.name?.type === "required" && <p className='text-red-500'>Name is required.</p>}

                    <label className="label">Email</label>
                    <input type="email" {...register("email", { required: true })} className="input w-full" placeholder="Email" />
                    {errors.email?.type === "required" && <p className='text-red-500'>Email is required.</p>}

                    <label className="label">Password</label>
                    <input type="password" {...register("password", {
                        required: true,
                        minLength: 6,
                        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/
                    })} className="input w-full" placeholder="Password" />
                    {errors.password?.type === "required" && <p className='text-red-500'>Password is required.</p>}
                    {errors.password?.type === "minLength" && <p className='text-red-500'>Password must be at least 6 characters.</p>}
                    {errors.password?.type === "pattern" && <p className='text-red-500'>Password must have at least one uppercase, one lowercase, one number and one special character.</p>}

                    <button className="btn btn-neutral mt-4">Register</button>
                </fieldset>
            </form>
            <SocialLogin></SocialLogin>
            <p className='mt-3'>Already have an account? <Link 
            state={location.state}
            className='hover:underline text-blue-700' 
            to={"/login"}>Login Here</Link></p>
        </div>
    );
};

export default Register;