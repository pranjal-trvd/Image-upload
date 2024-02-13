import React, { useState } from 'react'
import useSignup from './../hooks/useSignup';
import { Link } from 'react-router-dom';

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { loading, signup } = useSignup();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(name, email, password)
        await signup(name, email, password);
    };

    return (
        <div className="flex flex-col items-center justify-center min-w-96 mx-auto">
            <div className="w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
                <h1 className="text-3xl font-semibold text-center text-gray-300">
                    Signup
                    <span className="text-blue-500"> Image Uploader</span>
                </h1>

                <form onSubmit={handleSubmit}>
                    <div>
                        <label className="label p-2">
                            <span className="text-base label-text">Name</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter Name"
                            className="w-full input input-bordered h-10"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="label p-2">
                            <span className="text-base label-text">Email</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter Email"
                            className="w-full input input-bordered h-10"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="label">
                            <span className="text-base label-text">Password</span>
                        </label>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            className="w-full input input-bordered h-10"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div>
                        <Link
                            to="/login"
                            className="text-sm hover:underline hover:text-blue-600 mt-2 inline-block"
                        >
                            Already have an account? Login
                        </Link>

                        <button className="btn btn-block btn-sm mt-2" disabled={loading}>
                            {loading ? (
                                <span className="loading loading-spinner"></span>
                            ) : (
                                "Signup"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Signup