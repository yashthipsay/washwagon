"use client";
import React, { useState, useEffect } from 'react';
import socketIOClient, { Socket } from 'socket.io-client';
import './deliveryBoy.css'; // Import the CSS file for styling

interface Order {
    _id: string;
    items: string[];
    totalAmount: number;
    status: string;
}

const DeliveryBoyPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [notification, setNotification] = useState<string | null>(null);

    // Dynamically fetch the delivery boy ID (e.g., from auth or URL params)
    const deliveryBoyId = '60b5a3e4e4b0d617c4f6a0bb'; // Replace this with actual delivery boy ID, e.g., from auth

    // Socket connection to listen for new orders
    useEffect(() => {
        const socket: Socket = socketIOClient('http://localhost:5001'); // Replace with your server URL

        socket.on('newOrderAssigned', (data: { orderId: string }) => {
            console.log('New Order Assigned:', data);
            setNotification(`New order assigned: Order ID ${data.orderId}`);
            fetchOrders(); // Fetch new orders to reflect changes in the UI
        });

        return () => socket.disconnect(); // Clean up the socket connection on unmount
    }, []);

    // Fetch orders assigned to the delivery boy
    const fetchOrders = async () => {
        setIsLoading(true);
        setNotification(null); // Reset notification while loading
        try {
            const response = await fetch(`http://localhost:5001/api/orders/${deliveryBoyId}`);
            const data = await response.json();
            if (data.success) {
                setOrders(data.orders); // Assuming the response contains 'orders' and 'success'
            } else {
                setNotification('No orders assigned yet.');
            }
        } catch (error) {
            
            setNotification('Error fetching orders');
        } finally {
            setIsLoading(false);
        }
    };

    // Mark an order as delivered
    const markAsDelivered = async (orderId: string) => {
        try {
            const response = await fetch(`http://localhost:5001/api/orders/deliver/${orderId}`, {
                method: 'POST',
            });
            const data = await response.json();
            if (data.success) {
                setOrders(orders.filter(order => order._id !== orderId)); // Remove the delivered order from UI
                setNotification(`Order ${orderId} marked as delivered`);
            } else {
                setNotification('Failed to mark as delivered');
            }
        } catch (error) {
            setNotification('Error marking the order as delivered');
        }
    };

    // Fetch orders when component mounts
    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <div className="delivery-boy-container">
            <h1 className="delivery-boy-header">Delivery Boy Orders</h1>

            {isLoading ? (
                <p className="loading-spinner">Loading orders...</p>
            ) : (
                <div>
                    {notification && <div className="notification-banner">{notification}</div>}

                    <div className="space-y-4">
                        {orders.length === 0 ? (
                            <p>No orders assigned yet.</p>
                        ) : (
                            orders.map(order => (
                                <div key={order._id} className="order-card">
                                    <h3 className="order-title">Order ID: {order._id}</h3>
                                    <p className="order-description"><strong>Items:</strong> {order.items.join(', ')}</p>
                                    <p className="order-description"><strong>Total Amount:</strong> ${order.totalAmount}</p>
                                    <p className="order-description"><strong>Status:</strong> {order.status}</p>

                                    <button
                                        onClick={() => markAsDelivered(order._id)}
                                        className="delivered-button"
                                    >
                                        Mark as Delivered
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeliveryBoyPage;
