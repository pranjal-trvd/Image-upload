import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/authContext";

const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const { setAuthUser } = useAuthContext();

    const login = async (email, password) => {
        const success = handleInputErrors(email, password);
        console.log("login")
        if (!success) return;
        setLoading(true);
        try {
            const res = await fetch("/api/v1/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            if (data.status !== "success") {
                throw new Error(data.message);
            }

            localStorage.setItem("user", JSON.stringify(data.data));
            localStorage.setItem("accessToken", data.token);
            setAuthUser(data.data);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return { loading, login };
};

export default useLogin;

function handleInputErrors(email, password) {
    if (!email || !password) {
        toast.error("Please fill in all fields");
        return false;
    }

    return true;
}