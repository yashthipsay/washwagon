"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const response = await fetch('http://localhost:5001/api/customers/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        setLoading(false);

        if (response.ok) {
            // Redirect to the desired page after successful login
            router.push('/page');  // Adjust the route to point to your desired page
        } else {
            setError(data.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <nav className="bg-white shadow px-6 py-4">
                <div className="container mx-auto flex justify-between items-center">
                    <Link href="/landing" className="text-xl font-bold text-gray-800">
                        Back to Landing
                    </Link>
                </div>
            </nav>

            <div className="flex-1 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800">Login</h2>
                        <p className="text-gray-600 mt-2">Please log in to continue</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && <p className="text-red-500 text-center">{error}</p>}
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
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                            disabled={loading}
                        >
                            {loading ? 'Logging In...' : 'Login'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600"> </p>
                        <Link href="/signup">
                            <button className="text-blue-600 hover:underline mt-1">
                                Sign up here
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
