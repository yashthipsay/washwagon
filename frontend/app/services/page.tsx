"use client"
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const services = [
  {
    name: 'Pickup & Delivery',
    description: 'Hassle-free pickup and delivery service for your convenience.',
    price: '$10',
    details: 'We offer pickup and delivery services to make your laundry experience as convenient as possible.',
    locations: ['New York', 'Los Angeles', 'Chicago']
  },
  {
    name: 'Special Care Garments',
    description: 'Special care for garments that require extra attention.',
    price: '$15',
    details: 'Our special care service ensures that your delicate garments are handled with the utmost care.',
    locations: ['San Francisco', 'Miami', 'Houston']
  },
  {
    name: 'Commercial Laundry',
    description: 'Reliable laundry services for businesses and commercial clients.',
    price: '$20',
    details: 'We provide reliable and efficient laundry services for businesses and commercial clients.',
    locations: ['Seattle', 'Boston', 'Denver']
  }
];

// const Services = () => {
//   const [selectedService, setSelectedService] = useState(services[0]);

//   return (
//     <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
//       <div>
//         <h2 className="text-2xl font-bold mb-4">Our Services</h2>
//         <select
//           className="w-full p-2 border bg-slate-500 border-gray-300 rounded-md"
//           onChange={(e) => setSelectedService(services.find(service => service.name === e.target.value) || services[0])}
//         >
//           {services.map(service => (
//             <option key={service.name} value={service.name}>
//               {service.name}
//             </option>
//           ))}
//         </select>
//         <div className="mt-4 p-4 bg-slate-500 rounded-lg shadow-lg">
//           <h3 className="text-xl text-yellow-50 font-bold mb-2">{selectedService.name}</h3>
//           <p>{selectedService.description}</p>
//           <p className="mt-2">{selectedService.details}</p>
//           <h4 className="text-lg font-bold mt-4">Available Locations:</h4>
//           <ol className="list-decimal list-inside">
//             {selectedService.locations.map((location, index) => (
//               <li key={index}>{location}</li>
//             ))}
//           </ol>
//         </div>
//       </div>
//       <div>
//         <h2 className="text-2xl font-bold mb-4">Service Prices</h2>
//         <ul className="space-y-4">
//           {services.map(service => (
//             <li key={service.name} className="p-4 bg-slate-500 rounded-lg shadow-lg">
//               <h3 className="text-xl text-yellow-50 font-bold mb-2">{service.name}</h3>
//               <p className="text-yellow-50">{service.price}</p>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };


// export default Services;

const Services = () => {
    const [selectedService, setSelectedService] = useState(services[0]);
  
    return (
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 bg-gray-500 rounded-lg shadow-md">
          <h2 className="text-2xl text-gray-100 font-bold mb-4">Our Services</h2>
          <select
            className="w-full p-2 border bg-slate-600 border-gray-300 rounded-md"
            onChange={(e) => setSelectedService(services.find(service => service.name === e.target.value) || services[0])}
          >
            {services.map(service => (
              <option key={service.name} value={service.name}>
                {service.name}
              </option>
            ))}
          </select>
          <div className="mt-4 p-4 bg-gray-600 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-2">{selectedService.name}</h3>
            <p>{selectedService.description}</p>
            <p className="mt-2">{selectedService.details}</p>
          </div>
        </div>
        <div className="p-6 bg-gray-500 rounded-lg shadow-md">
          <h2 className="text-2xl text-gray-100 font-bold mb-4">Service Locations & Prices</h2>
          <div className="mt-4 p-4 bg-gray-600 rounded-lg shadow-lg">
            <h4 className="text-lg font-bold">Available Locations:</h4>
            <ol className="list-decimal list-inside">
              {selectedService.locations.map((location, index) => (
                <li key={index}>{location}</li>
              ))}
            </ol>
            <h4 className="text-lg font-bold mt-4">Service Prices:</h4>
            <p className="text-xl font-bold">{selectedService.price}</p>
          </div>
        </div>
      </div>
    );
  };
  
  export default Services;