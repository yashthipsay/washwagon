"use client"
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './about.css';

// const services = [
//   { name: 'Wash & Fold', description: 'Convenient wash and fold service for your everyday laundry needs.' },
//   { name: 'Dry Cleaning', description: 'Professional dry cleaning for delicate and special care garments.' },
//   { name: 'Ironing Services', description: 'Expert ironing services to keep your clothes wrinkle-free.' },
//   { name: 'Pickup & Delivery', description: 'Hassle-free pickup and delivery service for your convenience.' },
//   { name: 'Special Care Garments', description: 'Special care for garments that require extra attention.' },
//   { name: 'Commercial Laundry', description: 'Reliable laundry services for businesses and commercial clients.' },
// ];

const About = () => {
//   const [selectedService, setSelectedService] = useState(services[0]);
  return (
    <motion.div 
      className="container"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        About Us
      </motion.h2>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Welcome to WashWagon! We are dedicated to providing top-notch laundry services to our valued customers. Our mission is to make laundry day a breeze with our convenient and reliable services.
        </motion.p>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          At WashWagon, we understand the importance of clean clothes and the impact it has on your daily life. That's why we use the best equipment and eco-friendly detergents to ensure your clothes are not only clean but also well taken care of.
        </motion.p>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          Our team of experienced professionals is committed to delivering exceptional service with a smile. Whether you need a quick wash or a thorough cleaning, we've got you covered.
        </motion.p>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.5 }}
        >
          Thank you for choosing WashWagon. We look forward to serving you!
        </motion.p>
      </motion.div>
      {/* <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Our Services</h2>
        <select 
          className="w-full p-2 border bg-slate-500 border-gray-300 rounded-md"
          onChange={(e) => setSelectedService(services.find(service => service.name === e.target.value) || services[0])}
        >
          {services.map(service => (
            <option key={service.name} value={service.name}>
              {service.name}
            </option>
          ))}
        </select>
        <div className="mt-4 p-4 bg-slate-500 rounded-lg shadow-lg">
          <h3 className="text-xl text-yellow-50 font-bold mb-2">{selectedService.name}</h3>
          <p>{selectedService.description}</p>
        </div>
      </div> */}
    </motion.div>
    
  );
};

export default About;