import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const MyImages = () => {
    const [images, setImages] = useState([]);
    const token = localStorage.getItem("accessToken");

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await fetch("/api/v1/image/images", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(response.statusText);
                }

                const data = await response.json();
                console.log(data);
                setImages(data.data.images);
            } catch (error) {
                console.error("Error fetching images:", error);
            }
        };

        fetchImages();
    }, [token]);

    return (
        <div>
            <h1 className="text-2xl mb-4">Your Uploaded Images</h1>
            <Link to="/" className="text-blue-500 hover:underline block mb-4">
                Back to Home
            </Link>
            <div className="grid grid-cols-3 gap-4">
                {images.map((image, index) => (
                    <img
                        key={index}
                        src={`http://localhost:8080/uploads/${image}`}
                        alt={`Image ${index}`}
                        className="max-w-80 max-h-40 rounded"
                    />
                ))}
            </div>
        </div>
    );
};

export default MyImages;
