import React, { useState } from 'react'
import toast from "react-hot-toast";
import { useAuthContext } from "../context/authContext.jsx";

const useSignup = () => {
    const [loading, setLoading] = useState(false);
    const { setAuthUser } = useAuthContext();

    const signup = async (name, email, password) => {
        const success = handleInputErrors(name, email, password);
        if (!success) return;

        setLoading(true);
        try {
            const res = await fetch("/api/v1/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();
            if (data.status !== "success") {
                throw new Error(data.message);
            }
            localStorage.setItem("user", JSON.stringify(data.data));
            localStorage.setItem("accessToken", JSON.stringify(data.token));
            setAuthUser(data.data);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return { loading, signup };
}

function handleInputErrors(name, email, password) {
    console.log(name, email, password);
    if (!name || !email || !password) {
        toast.error("Please fill in all fields");
        return false;
    }

    if (password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return false;
    }

    return true;
}

export default useSignup