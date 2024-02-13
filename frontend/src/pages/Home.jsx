import toast from 'react-hot-toast';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/authContext';

const Home = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [image, setImage] = useState("");
    const token = localStorage.getItem('accessToken');
    const navigate = useNavigate();
    const { setAuthUser } = useAuthContext();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageSubmit = async () => {
        try {
            console.log(image);
            if (!image) {
                toast.error('Please select an image');
            }
            const formData = new FormData();
            formData.append('file', image);

            const response = await fetch('/api/v1/image/upload', {
                method: 'POST',
                body: formData,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (data.status !== "success") {
                throw new Error(data.message);
            }

            toast.success('Image uploaded successfully');
            setSelectedImage(null);
            setImage("");

            const fileInput = document.getElementById('image');
            if (fileInput) {
                fileInput.value = '';
            }

        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleLogout = () => {
        // Remove user and accessToken from localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        // Set authUser to null
        setAuthUser(null);
        // Navigate to the login page
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-800 text-white">
            <div className="bg-gray-700 p-8 rounded shadow-md w-96">
                <h1 className="text-2xl mb-4">Home Page</h1>

                {/* Image Input */}
                <div className="mb-4">
                    <label htmlFor="image" className="block text-gray-300 text-sm font-bold mb-2">Select an Image</label>
                    <input type="file" id="image" name="image" accept="image/*" onChange={handleImageChange} className="w-full p-2 border rounded bg-gray-600" />
                </div>

                {/* Display Selected Image */}
                {selectedImage && (
                    <div className="mb-4">
                        <img src={selectedImage} alt="Selected" className="max-w-full h-auto rounded" />
                    </div>
                )}

                {/* Submit Button */}
                <div>
                    <button onClick={handleImageSubmit} className="bg-blue-500 text-white py-2 rounded hover:bg-blue-700 focus:outline-none">
                        Submit Image
                    </button>
                </div>

                {/* Link to My Images */}
                <div className="mt-4">
                    <Link to="/my-images" className="text-blue-500 hover:underline">
                        View My Images
                    </Link>
                </div>

                {/* Logout Button */}
                <div className="mt-4">
                    <button onClick={handleLogout} className="text-red-500 hover:underline">
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Home;
