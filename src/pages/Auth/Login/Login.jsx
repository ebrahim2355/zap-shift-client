import React from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../../hooks/useAuth';
import { Link, useLocation, useNavigate } from 'react-router';
import SocialLogin from '../SocialLogin/SocialLogin';

const Login = () => {

    const { register, handleSubmit, formState: { errors } } = useForm();
    const { signInUser } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogin = (data) => {
        signInUser(data.email, data.password)
            .then(res => {
                console.log(res.user);
                navigate(location?.state || "/")
            })
            .catch(err => {
                console.log(err);
            })
    }

    return (
        <div>
            <h3 className="text-3xl font-bold text-center">Welcome Back!</h3>
            <p className='text-center py-2 text-2xl'>Please Log In....</p>
            <form onSubmit={handleSubmit(handleLogin)}>
                <fieldset className="fieldset">
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


                    <div><a className="link link-hover">Forgot password?</a></div>
                    <button className="btn btn-neutral mt-4">Login</button>
                </fieldset>
            </form>
            <SocialLogin></SocialLogin>
            <p className='mt-3'>New to Zap Shift? <Link 
            state={location.state}
            className='hover:underline text-blue-700' 
            to={"/register"}>Register Here</Link></p>
        </div>
    );
};

export default Login;