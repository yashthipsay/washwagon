"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";

export default function SignupPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userType, setUserType] = useState("customer"); // Default to 'customer'
    const [phone, setPhone] = useState(""); // For delivery partner
    const [vehicleType, setVehicleType] = useState(""); // For delivery partner
    const [licenseNumber, setLicenseNumber] = useState(""); // For delivery partner
    const [deliveryArea, setDeliveryArea] = useState(""); // For delivery partner
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [responseOk, setResponseOk] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (userType === "deliveryPartner" && (!vehicleType || !licenseNumber)) {
            setLoading(false);
            setError("Vehicle Type and License Number are required for delivery partners.");
            return;
        }

        const payload = userType === "deliveryPartner"
            ? { name, email, password, phone, vehicleType, licenseNumber, deliveryArea: deliveryArea.trim() || null }
            : { name, email, password };

        const apiUrl = userType === "deliveryPartner"
            ? "http://localhost:5001/api/deliveryBoys/signup"
            : "http://localhost:5001/api/customers/signup";

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include", // Ensures cookies are included in requests
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            setLoading(false);

            if (response.ok) {
                setResponseOk(true);

                // Store JWT token in HttpOnly cookies
                if (data.token) {
                    Cookies.set("jwt", data.token, { expires: 1, secure: true });
                }

                // Redirect after signup
                if (userType === "deliveryPartner") {
                    router.push("/deliveryBoy");
                } else {
                    router.push("/");
                }
            } else {
                setError(data.message || "Something went wrong!");
            }
        } catch (error) {
            setLoading(false);
            console.error("API request error:", error);
            setError("Network error or server not responding.");
        }
    };
    // Redirect after successful signup
    useEffect(() => {
        if (responseOk) {
            router.push("/"); // Redirect to the home or dashboard page if the signup is successful
        }
    }, [responseOk, router]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Navigation */}
            <nav className="bg-white shadow px-6 py-4">
                <div className="container mx-auto flex justify-between items-center">
                    <Link href="/landing" className="text-xl font-bold text-gray-800">
                        Back to Landing
                    </Link>
                </div>
            </nav>
            <div>
                <label className="block text-gray-700 mb-1">Sign up as:</label>
                <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="userType"
                            value="customer"
                            checked={userType === "customer"}
                            onChange={(e) => setUserType(e.target.value)}
                            className="mr-2"
                        />
                        <span>Customer</span>
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="userType"
                            value="deliveryPartner"
                            checked={userType === "deliveryPartner"}
                            onChange={(e) => setUserType(e.target.value)}
                            className="mr-2"
                        />
                        <span>Delivery Partner</span>
                    </label>
                </div>
            </div>
            {/* Auth Forms */}
            <div className="flex-1 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800">Welcome</h2>
                        <p className="text-gray-600 mt-2">Sign up or login to continue</p>
                    </div>

                    {/* Signup Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && <p className="text-red-500 text-center">{error}</p>}
                        <div>
                            <label htmlFor="name" className="block text-gray-700 mb-1">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your full name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                id="email"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                id="password"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Create a password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {/* Additional Fields for Delivery Partner */}
                        {userType === "deliveryPartner" && (
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="phone" className="block text-gray-700 mb-1">Phone</label>
                                    <input
                                        type="text"
                                        id="phone"
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter your phone number"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="vehicleType" className="block text-gray-700 mb-1">Vehicle Type</label>
                                    <input
                                        type="text"
                                        id="vehicleType"
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g., Bike, Car"
                                        value={vehicleType}
                                        onChange={(e) => setVehicleType(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="licenseNumber" className="block text-gray-700 mb-1">License Number</label>
                                    <input
                                        type="text"
                                        id="licenseNumber"
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter your license number"
                                        value={licenseNumber}
                                        onChange={(e) => setLicenseNumber(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="deliveryArea" className="block text-gray-700 mb-1">Delivery Area (Optional)</label>
                                    <input
                                        type="text"
                                        id="deliveryArea"
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter your delivery area (optional)"
                                        value={deliveryArea}
                                        onChange={(e) => setDeliveryArea(e.target.value)}
                                    />
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                            disabled={loading}
                        >
                            {loading ? "Signing Up..." : "Sign Up"}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600">Already have an account?</p>
                        <Link href="/login">
                            <button className="text-blue-600 hover:underline mt-1">
                                Login here
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
